# datatable-server-side two branches (master branch for whaterline, mongo branch mongo)
# clone it add an import to your project and use like this:
# dataTableServerSide(req.body, YOURMODEL)
#    .then((response) =>{
#      res.status(response.statusCode).json(response.data)
#    })
#    .catch((err) =>{
#      res.status(err.statusCode).json(err)
#    });