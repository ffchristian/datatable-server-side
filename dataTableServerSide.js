
import _ from 'lodash';

export default function serverSidePaginate(datatable, model) {

  let query = {};
  let index = datatable.order[0].column;
  let order = datatable.order[0].dir.toUpperCase();
  let column = datatable.columns[index];
  let search = datatable.search.value;
  let promise =  model.find();
  let promiseTotalRecords=  model.count();
  if(column.orderable == 'true' && column.data != '' ){
    promise.sort(column.data+' '+order);
  }

  if(search!= ''){
    query.or = [];

    _.forEach(datatable.columns, (value)=>{

      if(value.data !== '' && value.searchable == 'true' ){

        let json = {};
        json[value.data] = { contains: search || '' };
        query.or.push(json);

      };
    });
    promise.where(query);
    promiseTotalRecords.where(query);
  }
  console.log('query', query);
  console.log('start', datatable.start);
  console.log('length', datatable.length);
  return new Promise((resolve, reject) =>{

    promise
    .skip(datatable.start)
    .limit(datatable.length)
      //.paginate({ page: datatable.start, limit: datatable.length })
      .then((users) => {
        model.count()
          .then(count =>{
            promiseTotalRecords
              .then(countMatch =>{
                resolve({statusCode:200, message: 'DATA_TABLE_SUCCESS', data: {data: users, recordsFiltered: (count-countMatch === 0)? count: countMatch , recordsTotal: count, draw:  datatable.draw}});
              })
              .catch(err => {
                console.log(err);
                return reject({statusCode:400, message: 'ERROR_GETTING_TOTAL_MATCH_REGISTER'});
              });
          })
          .catch(err => {
            console.log(err);
            return reject({statusCode:400, message: 'ERROR_GETTING_TOTAL_REGISTER'});
          });
      })
      .catch(err => {
        return reject({statusCode:400, message: 'DATA_TABLE_QUERY_ERROR'});
      });


  });

}
