import dotenv from 'dotenv';

dotenv.config();
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export const isSnapraidRunning = async () => {
    try {
        const { stdout } = await execAsync("pgrep -x snapraid");
        return stdout.trim().length > 0;
    } catch (err) {
        return false;
    }
};

export const snapraidSync = async (prehash) => {
    const running = await isSnapraidRunning();

    if (running) {
        throw new Error("SnapRAID is running");
    }

    let config = process.env.CONFIG || "/etc/snapraid.conf";

    if(prehash){
        exec(`snapraid sync --pre-hash --config=${config}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running sync: ${error.message}`);
                return;
            }
            
            if (stderr) {
                console.error(`Error: ${stderr}`);
                return;
            }
            
            console.log(`Output:\n${stdout}`);
        });
    } else {
        exec(`snapraid sync --config=${config}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running sync: ${error.message}`);
                return;
            }
            
            if (stderr) {
                console.error(`Error: ${stderr}`);
                return;
            }
            
            console.log(`Output:\n${stdout}`);
        });
    }
}

export const snapraidScrub = async (p, o) => {
    const running = await isSnapraidRunning();

    if (running) {
        throw new Error("SnapRAID is running");
    }

    let config = process.env.CONFIG || "/etc/snapraid.conf";

    exec(`snapraid scrub -p ${p} -o ${o} --config=${config}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running scrub: ${error.message}`);
            return;
        }
        
        if (stderr) {
            console.error(`Error: ${stderr}`);
            return;
        }
        
        console.log(`Output:\n${stdout}`);
    });

}

export const snapraidStatus = async () => {
    const running = await isSnapraidRunning();

    if (running) {
        throw new Error("SnapRAID is running");
    }

    let config = process.env.CONFIG || "/etc/snapraid.conf";

    const { stdout } = await execAsync(`snapraid status --config=${config}`);
    return stdout;
};

export const snapraidCheck = async () => {
    const running = await isSnapraidRunning();

    if (running) {
        throw new Error("SnapRAID is running");
    }

    let config = process.env.CONFIG || "/etc/snapraid.conf";

    const { stdout } = await execAsync(`snapraid check --config=${config}`);
    return stdout;
};

export const snapraidSmart = async () => {
    const running = await isSnapraidRunning();

    if (running) {
        throw new Error("SnapRAID is running");
    }

    let config = process.env.CONFIG || "/etc/snapraid.conf";

    const { stdout } = await execAsync(`snapraid smart --config=${config}`);
    return stdout;
}