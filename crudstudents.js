//<--------Savita Khadse (SID-27565948)--------->



// const http = require('http');
const express = require('express');
const app = express();

app.use(express.json());

const fs = require('fs');
// const res = require('express/lib/response');

let rawdata = fs.readFileSync('STUDENT_DATA.json')

let students = JSON.parse(rawdata);

// const http = require ('http');

const StudentsAPIDetails = `Welcome to students API
The students API has 6 columns and 3 subarray and 50 data points.
Columns are:
1. SID
2. first_name,
3. last_name,
4. emailAddress,
5. majors
6. Subjects
    a. html
    b. css
    c. JavaScript


How to use API details are as below;
GET
1. To see all students: /api/students/

2. To filter students by a key: /api/students/filter:(e.g. ?major=programming|accounting) 

3. To search single student by id: /api/students/:id

POST

To insert new student using object format: /api/students:

PUT

To update an existing student: /api/students/id:

DELETE

To delete student by id: /api/students/:id

`

// GET: /: welcome screen that shows the user how to use the APIs
app.get('/', (req, res) => {
    res.send(StudentsAPIDetails);
});

// GET: /api/students: return the list of the students with the following format: (no sorting specified).
app.get('/api/students/', (req, res) => {
    res.send(students);

});

// this API can accept the following queryStrings: - sort=name - order=asc|desc exmple: /api/students?sort=name&order=asc default order is asc
app.get('/api/students', (req, res) => {

    let input = req.query
    console.log(input)
    sortByValue = input['sort'] || ''
    sortByorder = input['order'] || ''
    console.log(sortByValue, sortByorder)

    function sortBy(students, key) {
        return students.sort((a,b) => {
            if (a[key] < b[key]) return -1;
            else if (a[key] > b[key]) return 1;
            else return 0;

        })
    }

    function reversesortBy(students, key) {
        return students.sort((a, b) => {
            if (a[key] > b[key]) return -1;
            else if (a[key] < b[key]) return 1;
            else return 0;

        })
    }  
        if(sortByorder == 'desc'){
            let outputDESC = reversesortBy(students, sortByValue)
            res.send(outputDESC)
            console.log('DESC')
            }
        else if(sortByorder == 'asc'){
            let outputASC = sortBy(students, sortByValue)
            res.send(outputASC)
            console.log('ASC')
            }

});

//Query- http://localhost:3000/api/students
//Query- http://localhost:3000/api/students?order=desc
//Query- http://localhost:3000/api/students?sort=first_name&order=asc
//Query- http://localhost:3000/api/students?sort=first_name&order=desc

//Search by major
// GET: /api/students/filter: filters the students by a key, accepts major and returns users matches the major. Examples: ?major=art ?major=art|programming
//Sucess

app.get('/api/students/filter', (req, res) =>{
    let majorTitle = req.query['major']
    // console.log(req.query)
    console.log("Major: ", majorTitle['major'])

    const foundMajor = students.filter(students => students.majors == majorTitle);
    if (!foundMajor) res.status(404).send('The student with major is not found');
    res.send(foundMajor);
    console.log(foundMajor)

});


//Query- http://localhost:3000/api/students/filter?major=accounting


//search by ID
//Success- GET: /api/students/:id: returns a single student by id

app.get('/api/students/:id', (req, res) => {
    let student = students.find(c => c.SID === req.params.id);
    if (!student) res.status(404).send("The student ID is not available");
    res.send(student);
});

//Query- http://localhost:3000/api/students/G19116

//POST
//Success-/api/students: insert a new student submitted in the request body

app.post('/api/students', (req, res) => {

    function makeid() {
        let text = "";
        let SID = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let min = 10000;
        let max = 99999;
        
        for (var i = 0; i < 1; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            let num = Math.floor(Math.random() * (max - min + 1)) + min;
            SID = text + num;
            return SID;
        }
        
      };

    const student = {
            SID: makeid(),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            emailAddress: req.body.emailAddress,
            majors: req.body.majors,
            Subjects: req.body.Subjects,
            html: req.body.html,
            css: req.body.css,
            JavaScript: req.body.JavaScript
        }
            students.push(student);
            res.send(student);
            
    });

//Query- http://localhost:3000/api/students
// {
//     "first_name":"Savita",
//     "last_name":"Khadse",
//     "emailAddress":"shumblestone2@indiatimes.com",
//     "majors":"art",
//     "Subjects":[
//         {"html":4.1,"css":2.8,"JavaScript":2.1}
//         ]
// }   


//PUT(UPDATE)
//  PUT: /api/students/:id: updates an existing student id with the submitted data in the request body

 app.put('/api/students/:id', (req, res) => {

    const id = students.find(c => c.SID === req.params.id);
    if (!id) res.status(404).send("The student ID is not available");
        id.first_name= req.body.first_name;
        id.last_name = req.body.last_name;
        id.emailAddress = req.body.emailAddress;
        id.majors = req.body.majors;
        id.Subjects = req.body.Subjects;
        id.html = req.body.html;
        id.css = req.body.css;
        id.JavaScript = req.body.JavaScript

    res.send(id);
    console.log(req.params.id);
  });

//Query- http://localhost:3000/api/students/G19116

//DELETE
//  DELETE: /api/students/:id: deletes the student by id
 app.delete('/api/students/:id', (req, res) => {
    const id = students.find(c => c.SID === req.params.id);
    if (!id) res.status(404).send("The student ID is not available");
  
    // console.log(removeid)
    const index = students.indexOf(id);
    students.splice(index, 1);
  
    res.send(id);
  });

//Query- http://localhost:3000/api/students/G19116

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`))