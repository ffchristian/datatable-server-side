
import _ from 'lodash';

export default function serverSidePaginate(datatable, model) {

  let query = {};
  let index = datatable.order[0].column;
  let order = datatable.order[0].dir.toLowerCase();
  let column = datatable.columns[index];
  let search = datatable.search.value;
  let promise =  model.find();
  let promiseTotalRecords=  model.count();

  if(column.orderable == 'true' && column.data != '' ){
    let sortQuery = {};
    sortQuery[column.data] = (order == 'desc')? -1:1;
    promise.sort(sortQuery);
  }

  if(search && search!= ''){
    query.$or = [];

    _.forEach(datatable.columns, (value)=>{

      if(value.data !== '' && value.searchable == 'true' ){

        let json = {};
        //json[value.data] = { contains: search || '' };
        json[value.data] = { "$regex": search || '', "$options": "i" };
        query.$or.push(json);
      };
    });
    promise.where(query);
    promiseTotalRecords.where(query);
  }

  /*console.log('query', query);
  console.log('start', datatable.start);
  console.log('length', datatable.length);*/
  return new Promise((resolve, reject) =>{

    promise
    .skip(parseInt(datatable.start))
    .limit(parseInt(datatable.length))
      //.paginate({ page: datatable.start, limit: datatable.length })
      .then((users) => {
        model.count()
          .then(count =>{
            promiseTotalRecords
              .then(countMatch =>{
                resolve({statusCode:200, message: 'DATA_TABLE_SUCCESS', data: {data: users, recordsFiltered: (count-countMatch === 0)? count: countMatch , recordsTotal: count, draw:  datatable.draw}});
                return null;
              })
              .catch(err => {
                console.log(err);
                return reject({statusCode:400, message: 'ERROR_GETTING_TOTAL_MATCH_REGISTER'});
              });
            return null;
          })
          .catch(err => {
            console.log(err);
            return reject({statusCode:400, message: 'ERROR_GETTING_TOTAL_REGISTER'});
          });
        return null;
      })
      .catch(err => {
        console.log('-->', err);
        return reject({statusCode:400, message: 'DATA_TABLE_QUERY_ERROR'});
      });


  });

}
