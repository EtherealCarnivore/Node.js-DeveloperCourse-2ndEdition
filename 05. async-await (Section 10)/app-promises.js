const users = [{
    id: 1,
    name: 'Konstantin',
    schoolId: 106
},{
    id: 2,
    name: 'Nikola',
    schoolId: 69
}];
const grades = [{
    id: 1,
    schoolId: 106,
    grade: 90
},{
    id: 2,
    schoolId: 69,
    grade: 100
}, {
    id: 3,
    schoolId: 106,
    grade: 95
}];

const getUser = (id) => {
  return new Promise((resolve, reject) => {
     const user = users.find((user) =>  user.id === id)

      if(user){
          resolve(user);
      } else{
          reject(`Unable to find user with id of ${id}.`);
      }
  });
};

const getGrades = (schoolId) => {
return new Promise((resolve, reject) => {
    resolve(grades.filter((grade) => grade.schoolId == schoolId));
    });
};

//Name has a average% in the class
const getStatus = (userId) => {
    let user;
 return getUser(userId).then((tempUser) => {
     user = tempUser;
     return getGrades(user.schoolId);
 }).then((grades) => {
     let average = 0;

     if (grades.length > 0){
         average = grades.map((grade) => grade.grade).reduce((a, b) => a+ b) / grades.length;
     }
     return `${user.name} has an average of ${average}% in the class.`
 })
};

const getStatusAlt = async (userId) => {
    const user = await getUser(userId); //awaiting for a promise to resolve/reject
    const grades = await getGrades(user.schoolId);
    let average = 0;

    if (grades.length > 0){
        average = grades.map((grade) => grade.grade).reduce((a, b) => a+ b) / grades.length;
    }
    return `${user.name} has an average of ${average}% in the class.`
};

//async / await
// const getStatusAlt = async (userId) => { //need to mark function as async in order to use await
//     throw new Error('This is an error'); // this is how we handle reject with async (throwing an error == reject('error'))
//     return 'Shadowsong';
// };

// the function above is equivalent to the code below
// () => { //equivalent to creating a function that returns a new Promise
//  return New Promise((resolve, reject) => {
//      resolve('Shadowsong')
//     })
// };

getStatusAlt(1).then((status) => {
    console.log(status)
}).catch((e) => {
console.log(e);
});
// getStatus(432).then((status) => {
//     console.log(status);
// }).catch((e) => {
//     console.log(e)
// });