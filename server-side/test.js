// const signupUser = await fetch("http://localhost:3000/user/signup", {
//   method: "POST",
//   headers: { "Content-type": "application/json" },
//   body: JSON.stringify({
//     username: "pulkitkakar6",
//     password: "test",
//     email: "pulkitkakkar6@gmail.com",
//   }),
// });
// const response = await signupUser.json();
// console.log(response);
/*
{"message":"Admin Created","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InB1bGtpdGtha2FyNiIsInBhc3N3b3JkIjoidGVzdCIsImlhdCI6MTY5MTMzMjkzMCwiZXhwIjoxNjkxMzM2NTMwfQ.P31dQOjOXcAVF8A0DFnaIA6mr62VYV1cCqEBGN8mCRo"}
 */

const loginUser = await fetch("http://localhost:3000/user/login", {
  method: "POST",
  headers: { "Content-type": "application/json" },
  body: JSON.stringify({ username: "pulkitkakar6", password: "test" }),
});
const response1 = await loginUser.json();
console.log(response1);
/*
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InB1bGtpdGtha2FyNiIsInBhc3N3b3JkIjoidGVzdCIsImlhdCI6MTY5MTMzMzAxMCwiZXhwIjoxNjkxMzM2NjEwfQ.ADlWDSioLReU4C2Zxi7U4BjmaLs3q8assINrwZgkAEQ
 */

 const token = response1;
// const getCoursesEmpty = await fetch("http://localhost:3000/users/courses", {
//   method: "GET",
//   headers: {
//     "Content-type": "application/json",
//     authorization: "Bearer " + token,
//   },
// });
// const response = await getCoursesEmpty.json();
// console.log(response);
// {"courses":[]}

/*
{"courses":[{"_id":"64cfb3e8e6af21e543bedf38","courseName":"Course 1","teacherName":"Teacher 1","tags":["Tag 1","tag2 ","taggg"]},{"_id":"64cfb44be6af21e543bedf39","courseName":"Course 2","teacherName":"Teacher 2","tags":["Tag 1","tag2 ","taggg"]},{"_id":"64cfb464e6af21e543bedf3a","courseName":"Course 3","teacherName":"Teacher 3","tags":["Tag 1","tag2 ","taggg"]}]}
 */

const userBuyCourse=await fetch(`http://localhost:3000/user/buy-course/64cfb3e8e6af21e543bedf38`,{
  method:"PUT",
  headers:{"Content-type":"application/json", authorization:"Bearer "+token}
})
const response=await userBuyCourse.json();
console.log(response);
// // {"message":"Course Bought Successfully","userData":null}

// {"message":"Course Bought Successfully","userData":{"_id":"64cfb142ee9b950fcf47bc26","username":"pulkitkakar6","password":"test","email":"pulkitkakkar6@gmail.com","purchasedCourses":[{"_id":"64cfb3e8e6af21e543bedf38","courseName":"Course 1","teacherName":"Teacher 1","tags":["Tag 1","tag2 ","taggg"]},{"_id":"64cfb3e8e6af21e543bedf38","courseName":"Course 1","teacherName":"Teacher 1","tags":["Tag 1","tag2 ","taggg"]}],"__v":2}}



// const myCourses=await fetch("http://localhost:3000/user/my-courses",{
//   method:"GET",
//   headers:{"Content-type":"application/json", authorization:"Bearer "+token}
// })
// const response=await myCourses.json();
// console.log(response);
// for empty, response = []





// const testUser = await fetch("http://localhost:3000/auth-test-user", {
//   method: "GET",
//   headers: { "Content-type": "application/json" ,authorization:`bearer ${"token"}`},
// });
// const response2 = await testUser.json();
// console.log(response2);

// const loginAdmin = await fetch("http://localhost:3000/admin/login", {
//   method: "POST",
//   headers: { "Content-type": "application/json" },
//   body: JSON.stringify({ username: "pulkitkakar6", password: "test"}),
// });
// const response = await loginAdmin.json();
// console.log(response);

// const token=response;

// const testUser = await fetch("http://localhost:3000/auth-test-admin", {
//   method: "GET",
//   headers: { "Content-type": "application/json" ,authorization:`bearer ${token}`},
// });
// const response2 = await testUser.json();
// console.log(response2);
