const cds = require("@sap/cds");

module.exports = async (srv) => {
    const {
        Risks
      } = srv.entities;

    srv.on("READ", Risks, async (req, next) => {
        let items = await next();
        items = Array.isArray(items) ? items : [items];

        let userId = req.user.id;

        let filteredItems = items.filter(item => item.createdBy === userId);

        return filteredItems;
    });

}