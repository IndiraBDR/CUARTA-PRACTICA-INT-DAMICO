import supertest from "supertest";
import { expect } from "chai";
import { productManagerDB } from "../src/DAL/dao/mongoDao/products.dao.mongo.js";
import "../src/db/configDB.js"


//import "./db-test.js"

//"test": "mocha -t 10000 test/products-superTest.test.js"

//    "test": "mocha -t 10000 test/*.test.js" //para CORRER AMBOS TEST


const requester = supertest("http://localhost:8080")







//.set('Cookie',[`${cookieData.name}=${cookieData.value}`])



/* LOGIN


    it("should loged", async function () {


        const response = await requester.post('/api/sessions/login').send({

            email: "indiradamico22@gmail.com",
            password: "1234"

        });

       

    const cookie = response.headers["set-cookie"][0];

   // console.log(cookie);

         const cookieData={
             name:cookie.split("=")[0],
            value: cookie.split("=")[1].split(";")[0]
         }

        console.log('ACADATA',cookieData);
         expect(response.statusCode).to.be.equals(200);

    })
*/




/* TEST PRODUCTS ALL
describe('GET/api/products', function () {

    it("should return an object", async function () {

        const objParams = { limit: 10, sort: -1, page: 1 }

        const response = await requester.get("/api/products").query(objParams)

        const productsAllTest = response._body.products

        //const limitTest=response.req._header

        expect(productsAllTest).to.be.an('object')
        expect(productsAllTest).to.have.property('payload')
        expect(productsAllTest.payload).to.be.an('array')
        expect(productsAllTest.payload).to.have.lengthOf(objParams.limit);
        expect(response.statusCode).to.be.equals(200);
    }
    )


}


)

*/


/*TEST PRODUCTS BY ID
describe('GET/api/products/:pid', function() {

    it("should return an object", async function() {
        
        const products  = await requester.get("/api/products")

         const productsList= products._body.products.payload

         const product =productsList[0]

         const response  = await requester.get(`/api/products/${product._id}`)

         console.log(response._body.productoFiltrado);

         expect(response._body.productoFiltrado).to.be.an('object')
         expect(response.statusCode).to.be.equals(200);
    }

    )


}

)
*/


/* CREATED PRODUCT FUNCIONANDOOOO

let cookieData
describe('POST/api/products', function () {

    before( async function () {


        let user = {

            
            email: "premium2@gmail.com",
            password: "1234"
           
          
            }
    
         const response = await requester.post('/api/sessions/login').send(user);
        const cookie = response.headers["set-cookie"][0];
         cookieData={
            name:cookie.split("=")[0],
            value: cookie.split("=")[1].split(";")[0]
        }
   
     //  console.log('ACADATA',cookieData);

     // console.log(response.headers);
       
      });

   
     
    
       it("should created product??", async function () {
   
           const objBody={
   
                title: 'titulo88',
               
               description: 'descripcion88',
               
               price: 40,
               
               code:'abc1288',
               
               stock: 4,
               
               category: 'BBB',
               
               thumbnails: 'xxxx87'
               
           }

           //const response1=  await requester.get("/api/sessions/current").set('Cookie',[`${cookieData.name}=${cookieData.value}`])
// console.log(response1);

           const response = await requester.post("/api/products").set('Cookie',[`${cookieData.name}=${cookieData.value}`]).send(objBody)

         
   
           

           console.log(response);
           
           const newProductTest = response._body.product
   
           console.log("NUEVOO PRODUCTO",newProductTest);
   
   
           expect(newProductTest).to.be.an('object')
           expect(response.statusCode).to.be.equals(200);
       }
       )

    

 

})





/*






/*TEST PRODUCT UPDATE

describe('PUT/api/products/:pid', function() {

    it("should return an object", async function() {
        
        const products  = await requester.get("/api/products")

         const productsList= products._body.products.payload

         const product =productsList[0]

         const response  = await requester.get(`/api/products/${product._id}`)

        // console.log(response._body.productoFiltrado);

         expect(response._body.productoFiltrado).to.be.an('object')
         expect(response.statusCode).to.be.equals(200);
    }

    )


}

)

*/



//TEST PRODUCT DELETE

let cookieData

describe('DELETE/api/products/:pid', function () {

    before(async function () {


        let user = {


            email: "premium2@gmail.com",
            password: "1234"


        }

        const response = await requester.post('/api/sessions/login').send(user);
        const cookie = response.headers["set-cookie"][0];
        cookieData = {
            name: cookie.split("=")[0],
            value: cookie.split("=")[1].split(";")[0]
        }



    });


    it("should return an object", async function () {

        const objBody = {

            title: 'titulo85POST',

            description: 'descripcion85',

            price: 40,

            code: 'abc12845',

            stock: 4,

            category: 'BBB',

            thumbnails: 'xxxx85'

        }

        const responseCreated = await requester.post("/api/products").set('Cookie', [`${cookieData.name}=${cookieData.value}`]).send(objBody)

        console.log('CREATED', responseCreated);

        const productId = responseCreated._body.product._id

        const responseDelete = await requester.delete(`/api/products/${productId}`).set('Cookie', [`${cookieData.name}=${cookieData.value}`])

        console.log(responseDelete._body);


        expect(responseDelete.statusCode).to.be.equals(200);
    }

    )
    //probar borrar el producto que no creo buscando el producto como en el find by id

}

)
