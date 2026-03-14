import authRoutes from "./auth_routes.js"
import functional_routes from "./functional_routes.js"

const constructorMethod = (app) => {
    app.use('/auth/', authRoutes);
    app.use('/functions', functional_routes);
    app.use('*', (req, res) => {
        return res.status(404).json({error: 'Not found'});
    });
};
  
export default constructorMethod;