const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// SQL Server configuration
var config = {
    "user": "Sagri", // Database username
    "password": "Ananth1986*", // Database password
    "server": "SG2NWPLS19SQL-v05.mssql.shr.prod.sin2.secureserver.net", // Server IP address
    "database": "NIVA", // Database name
    "options": {
        "encrypt": false // Disable encryption
    }
}

let db = sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

//final data of soil
// app.get('/cropdetails',async(req, res) => {
//     try{
//         const pool = await sql.connect(config);
//         const sno = req.query.sno;
//         const a_date = req.query.a_date
//         console.log(sno,"1111111")

//         const result = await pool.request()
//         .input('sno',sql.VarChar,sno)
//         .input('a_date',sql.Date,a_date)
//         .query('SELECT * FROM dbo.soil_predictions WHERE sno=@sno and a_date=@a_date');
//         res.json(result);
//         console.log(result.recordsets,"result")
//     }catch(err){
//         console.error('SQL error',err);
//         res.status(500).send('Internal server error');
//     }
//     });

//SOIL

//final data of soil

app.get('/cropdetails',async(req, res) => {
    try{
        const pool = await sql.connect(config);
        const sno = req.query.sno;
        const a_date = req.query.a_date
        console.log(sno,"1111111")
        console.log(a_date,"2222222")


            const dateArray = a_date.split(',').map(date=>date.trim());
            let datePlaceholder = dateArray.map((_,index)=>`@date${index}`).join(',');
            const query = `SELECT * FROM dbo.soil_predictions WHERE sno=@sno and a_date IN (${datePlaceholder})`;


        let request = pool.request().input('sno',sql.VarChar,sno);
        // .input('a_date',sql.Date,a_date)
        dateArray.forEach((date,index) => {
            request = request.input(`date${index}`,sql.DateTime,date);
            
        });
        const result=await request.query(query);
        res.json(result);
        console.log(result.recordsets,"result")
    }catch(err){
        console.error('SQL error',err);
        res.status(500).send('Internal server error');
    }
    });

    //datevalues for soil

app.get('/datevalues',async(req, res) => {
    try{
        const pool = await sql.connect(config);
        const sno = req.query.sno;
        
        console.log(sno,"1111111")

        const result = await pool.request()
        .input('sno',sql.VarChar,sno)
        .query('SELECT a_date FROM dbo.Crop_Calendar WHERE sno=@sno and a_status=1 and activity=1 order by a_date DESC');
        res.json(result);
        console.log(result.recordsets,"result")
    }catch(err){
        console.error('SQL error',err);
        res.status(500).send('Internal server error');
    }
    });

    //searchbar api


//     app.get('/search', async (req, res) => {
//         try {
            
// console.log("11111")
//             const pool = await sql.connect(config);
//             const sno = req.query.sno;
//             const crop_cno = req.query.crop_cno;
    
          
//             console.log("222222")
//             const result = await pool.request()
//                 .input('sno', sql.VarChar, sno)
//                 .input('crop_cno', sql.VarChar, crop_cno)
//                 .query('SELECT * FROM dbo.soil_predictions WHERE sno = @sno AND crop_cno = @crop_cno');
//                 console.log(result, "Result Sets");
//             res.json(result);
            
//         } catch (err) {
//             console.error('SQL error', err);
//             res.status(500).send('Internal server error');
//         }
//     });



app.get('/search', async (req, res) => {
    try {
        
        console.log("11111")
        const pool = await sql.connect(config);
        const sno = req.query.sno;
        const a_date = req.query.a_date;
        const crop_cno = req.query.crop_cno;
        console.log(sno,"ssssss");
        console.log(crop_cno,"ccccccc");
        console.log(a_date,"aaaaaa");
        
        let a_dateArray = [];
        if(a_date){
            a_dateArray = a_date.split(',').map(date=>date.trim());
        }

        console.log(a_dateArray,"converted to array");
        const Placeholder = a_dateArray.map((_,index)=>`@a_date_${index}`).join(',');
      const query =
      `SELECT * FROM dbo.soil_predictions WHERE sno = @sno AND crop_cno = @crop_cno AND a_date IN (${Placeholder})`;
       
    


        const request =  pool.request()
            .input('sno', sql.VarChar, sno)
            .input('crop_cno', sql.VarChar, crop_cno)
           
            a_dateArray.forEach((date,index)=>{
                request.input(`a_date_${index}`,sql.Date,date);
            });
            const result = await request.query(query);
            console.log(result,"result sets");
        res.json(result.recordset);
        
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Internal server error');
    }
});


//sorting api soil         
    // app.get('/sortingapi', async (req, res) => {
    //     try {
    //         const pool = await sql.connect(config);
    //         const sno = req.query.sno;
                                                                                                                             
          
    //         const sort_by = parseInt(req.query.sort_by);
    //         console.log(sno,"sss");
    //         console.log(sort_by,"sorttt");
    
           
    //         const order = (sort_by === 1 || sort_by === -1) ? (sort_by === 1 ? 'ASC' : 'DESC') : 'ASC';
    
    //         console.log(order,'orderrrr')
    
    //         const result = await pool.request()
    //             .input('sno', sql.VarChar, sno)
    //             .query(`SELECT * FROM dbo.soil_predictions WHERE sno = @sno  ORDER BY a_date ${order}`);
            
    //             console.log(result,"rrrrrrrrrr");
    //         res.json(result);
            
    //     } catch (err) {
    //         console.error('SQL error', err);
    //         res.status(500).send('Internal server error');
    //     }
    // });


app.get('/sortingapi', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const sno = req.query.sno;
      const a_date = req.query.a_date;
      const sort_by = parseInt(req.query.sort_by);
  
      console.log(sno, "sss");
      console.log(sort_by, "sorttt");
      console.log(a_date,"aaaa")
  
      const order = (sort_by === 1 || sort_by === -1) ? (sort_by === 1 ? 'ASC' : 'DESC') : 'ASC';
  
      console.log(order, 'orderrrr');
  
      // Parse a_date into an array
      let a_dateArray = [];
      if (a_date) {
        a_dateArray = a_date.split(',').map(date => date.trim());
      }
  
      console.log(a_dateArray, "converted to array");
  
      // Create dynamic placeholders for SQL query
      const placeholders = a_dateArray.map((_, index) =>` @a_date_${index}`).join(',');
  
      // Construct SQL query with IN clause for a_date array
      const query = `SELECT * FROM dbo.soil_predictions WHERE sno = @sno AND a_date IN (${placeholders}) ORDER BY a_date ${order}`;
  
      const request = pool.request()
        .input('sno', sql.VarChar, sno);
  
      // Add each date to the request
      a_dateArray.forEach((date, index) => {
        request.input(`a_date_${index}`, sql.Date, date);
      });
  
      const result = await request.query(query);
      console.log(result, "result sets");
      res.json(result.recordset);
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).send('Internal server error');
    }
  });



//VI


    //final data of VI
app.get('/videtails',async(req, res) => {
    try{
        const pool = await sql.connect(config);
        const sno = req.query.sno;
        const a_date = req.query.a_date
        console.log(sno,"1111111")
        console.log(a_date,"2222222")


            const dateArray = a_date.split(',').map(date=>date.trim());
            let datePlaceholder = dateArray.map((_,index)=>`@date${index}`).join(',');
            const query = `SELECT * FROM dbo.vi_predictions WHERE sno=@sno and a_date IN (${datePlaceholder})`;


        let request = pool.request().input('sno',sql.VarChar,sno);
        // .input('a_date',sql.Date,a_date)
        dateArray.forEach((date,index) => {
            request = request.input(`date${index}`,sql.DateTime,date);
            
        });
        const result=await request.query(query);
        res.json(result);
        console.log(result.recordsets,"result")
    }catch(err){
        console.error('SQL error',err);
        res.status(500).send('Internal server error');
    }
    });

    //api for vi map predictions 
    // app.get('/vimap',async(req, res) => {
    //     try{
    //         const pool = await sql.connect(config);
    //         const sno = req.query.sno;
    //         const a_date = req.query.a_date
    //         console.log(sno,"1111111");
    //         console.log(a_date,"2222222");
    
    
    //             const dateArray = a_date.split(',').map(date=>date.trim());
    //             let datePlaceholder = dateArray.map((_,index)=>`@date${index}`).join(',');
    //             const query = `SELECT * FROM dbo.vimap_predictions WHERE sno=@sno and a_date IN (${datePlaceholder})`;
    
    
    //         let request = pool.request().input('sno',sql.VarChar,sno);
    //         // .input('a_date',sql.Date,a_date)
    //         dateArray.forEach((date,index) => {
    //             request = request.input(`date${index}`,sql.DateTime,date);
                
    //         });
    //         const result=await request.query(query);
    //         res.json(result);
    //         console.log(result.recordsets,"result")
    //     }catch(err){
    //         console.error('SQL error',err);
    //         res.status(500).send('Internal server error');
    //     }
    //     });





        app.get('/vimap',async(req, res) => {
            try{
                const pool = await sql.connect(config);
                const sno = req.query.sno;
                const a_date = req.query.a_date
                console.log(sno,"1111111");
                console.log(a_date,"2222222");
                
        
        
                let result = await pool.request()
                .input('sno',sql.VarChar,sno)
                .input('a_date',sql.Date,a_date)
                .query(`SELECT * FROM dbo.vimap_predictions WHERE sno=@sno AND a_date=@a_date`)
                
                    
                res.send(result.recordsets);
                console.log(result.recordsets,"resultssssssssssssss")
                
            }catch(err){
                console.error('SQL error',err);
                res.status(500).send('Internal server error');
            }
            });

        //datevalues for VI

app.get('/datevi',async(req, res) => {
    try{
        const pool = await sql.connect(config);
        const sno = req.query.sno;
        
        console.log(sno,"1111111")

        const result = await pool.request()
        .input('sno',sql.VarChar,sno)
        .query('SELECT a_date FROM dbo.Crop_Calendar WHERE sno=@sno and a_status=1 and activity=2 order by a_date DESC');
        res.json(result);
        console.log(result.recordsets,"result")
    }catch(err){
        console.error('SQL error',err);
        res.status(500).send('Internal server error');
    }
    });

    //searchbar vi
//     app.get('/searchvi', async (req, res) => {
//         try {
            
// console.log("11111")
//             const pool = await sql.connect(config);
//             const sno = req.query.sno;
//             const crop_cno = req.query.crop_cno;
    
          
//             console.log("222222")
//             const result = await pool.request()
//                 .input('sno', sql.VarChar, sno)
//                 .input('crop_cno', sql.VarChar, crop_cno)
//                 .query('SELECT * FROM dbo.vi_predictions WHERE sno = @sno AND crop_cno = @crop_cno');
//                 console.log(result, "Result Sets");
//             res.json(result);
            
//         } catch (err) {
//             console.error('SQL error', err);
//             res.status(500).send('Internal server error');
//         }
//     });

    
    //searchbarvi api
    app.get('/searchvi', async (req, res) => {
        try {
            
            console.log("11111")
            const pool = await sql.connect(config);
            const sno = req.query.sno;
            const a_date = req.query.a_date;
            const crop_cno = req.query.crop_cno;
            console.log(sno,"ssssss");
            console.log(crop_cno,"ccccccc");
            console.log(a_date,"aaaaaa");
            
            let a_dateArray = [];
            if(a_date){
                a_dateArray = a_date.split(',').map(date=>date.trim());
            }

            console.log(a_dateArray,"converted to array");
            const Placeholder = a_dateArray.map((_,index)=>`@a_date_${index}`).join(',');
          const query =
          `SELECT * FROM dbo.vi_predictions WHERE sno = @sno AND crop_cno = @crop_cno AND a_date IN (${Placeholder})`;
           
        
    

            const request =  pool.request()
                .input('sno', sql.VarChar, sno)
                .input('crop_cno', sql.VarChar, crop_cno)
               
                a_dateArray.forEach((date,index)=>{
                    request.input(`a_date_${index}`,sql.Date,date);
                });
                const result = await request.query(query);
                console.log(result,"result sets");
            res.json(result.recordset);
            
        } catch (err) {
            console.error('SQL error', err);
            res.status(500).send('Internal server error');
        }
    });

    //sorting api vi

    app.get('/sortingviapi', async (req, res) => {
        try {
          const pool = await sql.connect(config);
          const sno = req.query.sno;
          const a_date = req.query.a_date;
          const sort_by = parseInt(req.query.sort_by);
      
          console.log(sno, "sss");
          console.log(sort_by, "sorttt");
          console.log(a_date,"aaaa")
      
          const order = (sort_by === 1 || sort_by === -1) ? (sort_by === 1 ? 'ASC' : 'DESC') : 'ASC';
      
          console.log(order, 'orderrrr');
      
          // Parse a_date into an array
          let a_dateArray = [];
          if (a_date) {
            a_dateArray = a_date.split(',').map(date => date.trim());
          }
      
          console.log(a_dateArray, "converted to array");
      
          // Create dynamic placeholders for SQL query
          const placeholders = a_dateArray.map((_, index) =>` @a_date_${index}`).join(',');
      
          // Construct SQL query with IN clause for a_date array
          const query = `SELECT * FROM dbo.vi_predictions WHERE sno = @sno AND a_date IN (${placeholders}) ORDER BY a_date ${order}`;
      
          const request = pool.request()
            .input('sno', sql.VarChar, sno);
      
          // Add each date to the request
          a_dateArray.forEach((date, index) => {
            request.input(`a_date_${index}`, sql.Date, date);
          });
      
          const result = await request.query(query);
          console.log(result, "result sets");
          res.json(result.recordset);
        } catch (err) {
          console.error('SQL error', err);
          res.status(500).send('Internal server error');
        }
      });

    // app.get('/sortingviapi', async (req, res) => {
    //     try {
    //         const pool = await sql.connect(config);
    //         const sno = req.query.sno;
    //         const a_date = req.query.a_date;
                                                                                                                             
        
    //         const sort_by = parseInt(req.query.sort_by);
    //         console.log(sno,"sss");
    //         console.log(sort_by,"sorttt");
    
           
    //         const order = (sort_by === 1 || sort_by === -1) ? (sort_by === 1 ? 'ASC' : 'DESC') : 'ASC';
    
    //         console.log(order,'orderrrr')
    
    //         const result = await pool.request()
    //             .input('sno', sql.VarChar, sno)
    //             .query(`SELECT * FROM dbo.vi_predictions WHERE sno = @sno  ORDER BY a_date ${order}`);
            
    //             console.log(result,"rrrrrrrrrr");
    //         res.json(result);
            
    //     } catch (err) {
    //         console.error('SQL error', err);
    //         res.status(500).send('Internal server error');
    //     }
    // });

    















    //api for users checking

    app.get('/checkuser',async(req,res)=>{
        try{
            const pool  =  await sql.connect(config);
            const userid = req.query.userid
            const result = await pool.request().input('userid',sql.VarChar,userid).query('SELECT * FROM dbo.users WHERE userid=@userid');
            if(!result){
                res.send('users not found');

            }
            // res.send('user found')
            res.send(result)


        }
        catch(err){
            res.send('internal server error')
        }
    })


    
//cropCalendar
    app.get('/crop',async(req, res) => {
        try{
            const pool = await sql.connect(config);
            const sno = req.query.sno;
            console.log(sno,"1111111")
    
            const result = await pool.request().input('sno',sql.VarChar,sno).query('SELECT * FROM dbo.Crop_Calendar WHERE sno=@sno');
            res.json(result);
            console.log(result.recordsets,"result")
        }catch(err){
            console.error('SQL error',err);
            res.status(500).send('Internal server error');
        }
        });











        
  app.post('/soil', async (req, res) => {
    const { sno, crop_cno, activity_no, a_date, s_date, AN, Boron, Copper, Ec, Iron, Mangan, OC,  Phos, Pot, Ph, Sulph, Zinc } = req.body;
  
    try {
        const request = new sql.Request();
        request.input('sno', sql.NVarChar, sno);
        request.input('crop_cno', sql.NVarChar, crop_cno);
        request.input('activity_no', sql.Int, activity_no);
        request.input('a_date', sql.Date, a_date);
        request.input('s_date', sql.Date, s_date);
        request.input('AN', sql.Float, AN);
        request.input('Boron', sql.Float, Boron);
        request.input('Copper', sql.Float, Copper);
        request.input('Ec', sql.Float, Ec);
        request.input('Iron', sql.Float, Iron);
        request.input('Mangan', sql.Float, Mangan);
        request.input('OC', sql.Float, OC);
        request.input('Phos', sql.Float, Phos);
        request.input('Pot', sql.Float, Pot);
        request.input('Ph', sql.Float, Ph);
        request.input('Sulph', sql.Float, Sulph);
        request.input('Zinc', sql.Float, Zinc);
  
        const query = `
            INSERT INTO dbo.soil_predictions (sno, crop_cno, activity_no, a_date, s_date, AN, Boron, Copper, Ec, Iron, Mangan, OC, Phos, Pot, Ph, Sulph, Zinc)
            VALUES (@sno, @crop_cno, @activity_no, @a_date, @s_date, @AN, @Boron, @Copper, @Ec, @Iron, @Mangan, @OC, @Phos, @Pot, @Ph, @Sulph, @Zinc);
        `;
  
        const result = await request.query(query);
        res.json({ message: 'User added successfully' });
        console.log("user added successfully");
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: 'An error occurred while adding the user' });
        console.log("error occured");
    }
  });

//delete query 

  app.delete('/soil/:sno', async (req, res) => {
      const { sno } = req.params;
  
      try {
          const request = new sql.Request();
          request.input('sno', sql.NVarChar, sno);
          
          const query = `
              DELETE FROM dbo.soil_predictions
              WHERE sno = @sno;
          `;
  
          const result = await request.query(query);
          
          if (result.rowsAffected[0] > 0) {
              res.json({ message: 'Record deleted successfully' });
              console.log("Record deleted successfully");
          } else {
              res.status(404).json({ error: 'Record not found' });
              console.log("Record not found");
          }
      } catch (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: 'An error occurred while deleting the record' });
          console.log("Error occurred");
      }
  });


  
  app.get('/usertype',async(req, res) => {
    try{
        const pool = await sql.connect(config);
        const userid = req.query.userid;
        console.log(userid,"useridddd")
        const desig = req.query.desig;
        console.log(desig,"desiggg")

        const result = await pool.request()
        .input('userid',sql.VarChar,userid)
        .query('SELECT * FROM dbo.users WHERE userid=@userid');

        if(result.recordset.length ===0){
            return res.status(404).send('User not found');
        }

        let snoResult;

        if(desig === 'ADMINISTRATOR'){
            snoResult = await pool.request()
            .input('userid',sql.VarChar,userid)
            .query(`SELECT sno FROM dbo.land WHERE oid=(SELECT oid FROM dbo.users WHERE userid=@userid)`)
           
        }
        else if(desig === 'Agent'){
            snoResult = await pool.request()
             .input('userid',sql.VarChar,userid)
            .query(`SELECT sno FROM dbo.farmer WHERE daeo=@userid`)
           
        }else if(desig === 'Farmer'){
            snoResult = await pool.request()
            .input('userid',sql.VarChar,userid)
            .query(`SELECT sno FROM dbo.farmer WHERE name=@userid`);
        }else {
            return res.status(400).send('Invalid designation');
        }
        console.log(snoResult,"snooo");
        res.json(snoResult);
       

        }catch(err){
            console.error('SQL error',err);
            res.status(500).send('Internal server error');
        }
    });
  


    

    

    


   
    



//filter api
    app.get('/filter',async(req, res) => {
        try{
            const pool = await sql.connect(config);
            const crop_cno = req.query.crop_cno;
            const a_date = req.query.a_date;
            const s_date = req.query.s_date;
            console.log(a_date,"1111111")
    
            const result = await pool.request()
            .input('crop_cno', sql.VarChar, crop_cno).query(`SELECT * FROM dbo.soil_predictions WHERE crop_cno=@crop_cno`)
            .input('a_date',sql.Date,a_date).query('SELECT * FROM dbo.soil_predictions WHERE a_date=@a_date')
            .input('s_date',sql.Date,s_date).query('SELECT * FROM dbo.soil_predictions WHERE s_date=@s_date')
            res.json(result);
            console.log(result.recordsets,"resultssssss")
        }catch(err){
            console.error('SQL error',err);
            res.status(500).send('Internal server error');
        }
        })

    
//to display all datas
app.get('/soils', (req, res) => {
    
    db.query('SELECT * FROM dbo.soil_predictions', (err, results) => {
      if (err) console.log(err);
      console.log("good");
      res.json(results);
    });
  });


  //to display all datas
app.get('/vi', (req, res) => {
    
    db.query('SELECT * FROM dbo.vi_predictions', (err, results) => {
      if (err) console.log(err);
      console.log("good");
      res.json(results);
    });
  });

//farmer table
  app.get('/farmer', (req, res) => {
    
    db.query('SELECT * FROM dbo.farmer', (err, results) => {
      if (err) console.log(err);
      console.log("good");
      res.json(results);
    });
  });

  //Users table(post)

  app.post('/userpost', async (req, res) => {
    const { userid, pass, desig, email, region, mobile, name, status, oid } = req.body;
  
    try {
        const request = new sql.Request();
        request.input('userid', sql.NVarChar, userid);
        request.input('pass', sql.NVarChar, pass);
        request.input('desig', sql.NVarChar, desig);
        request.input('email', sql.NVarChar, email);
        request.input('region', sql.NVarChar, region);
        request.input('mobile', sql.NVarChar, mobile);
        request.input('name', sql.NVarChar, name);
        request.input('status', sql.Int, status);
        request.input('oid', sql.NVarChar, oid);
  
        const query = `
            INSERT INTO dbo.users (userid, pass, desig, email, region, mobile, name, status, oid)
            VALUES (@userid, @pass, @desig, @email, @region, @mobile, @name, @status, @oid);
        `;
  
        const result = await request.query(query);
        res.json({ message: 'User added successfully' });
        console.log("user added successfully");
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: 'An error occurred while adding the user' });
        console.log("error occured");
    }
  });


  //land table
  app.get('/land', (req, res) => {
    
    db.query('SELECT * FROM dbo.land', (err, results) => {
      if (err) console.log(err);
      console.log("good");
      res.json(results);
    });
  });

   //users table
   app.get('/users', (req, res) => {
    
    db.query('SELECT * FROM dbo.users', (err, results) => {
      if (err) console.log(err);
      console.log("good");
      res.json(results);
    });
  });

 
  






// Start the server on port 3000
app.listen(3001, () => {
    console.log("Listening on port 3001...");
});


