const s3bucket = require('../config/s3ConnectionObject');
const FileUpload = require('../model/FileUpload')

const handleUpload = async (req, res, next) => {
    if (!req.files) return res.status(400).json({ status: "No files uploaded" })
    const allFiles = req.files.files;
    var fileList = []
    for(let file of allFiles){
        const [fileName, fileExtension] = file.name.split(/\.(?=[^\.]+$)/);
        var nameOfFileToUpload = fileName + '_' + Date.now() + '.' + fileExtension
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: nameOfFileToUpload,
            Body: file.data
        };
        fileList.push(nameOfFileToUpload)
        console.log('files uploaded are : ', fileList)
        S3UploadFile(params)
        console.log('req.user====',req.user)
        try {
            const result = await FileUpload.create({
                filename: nameOfFileToUpload,
                timestamp: new Date(),
                uploadedby : req.user
            });
    
        } catch (err) {
            console.error(err);
        }
    }

    next()
    // Object.keys(allFiles).forEach(key => {
        // const [fileName, fileExtension] = allFiles[key].name.split(/\.(?=[^\.]+$)/);
        // var nameOfFileToUpload = fileName + '_' + Date.now() + '.' + fileExtension
        // var params = {
        //     Bucket: process.env.AWS_BUCKET_NAME,
        //     Key: nameOfFileToUpload,
        //     Body: allFiles[key].data
        // };
        // fileList.push(nameOfFileToUpload)
        // console.log('files uploaded are : ', fileList)
        // // S3UploadFile(params)
        // try {
        //     const result = await FileUpload.create({
        //         filename: nameOfFileToUpload,
        //         timestamp: new Date(),
        //         uploadedby : req.user
        //     });
    
        //     res.status(201).json(result);
        // } catch (err) {
        //     console.error(err);
        // }
    // })

    

    // next()
}

const listFiles = async (req, res, next) => {
    var options = {
        Bucket: process.env.AWS_BUCKET_NAME,
        MaxKeys: 10,
    };
    const bucketData = s3bucket.listObjects(options).promise()
    bucketData.then((response) => {
        res.status(200).send(response)

    }).catch((error) => {
        res.status(500).send(error)
    })
}

const handleDownload = async (req, res, next) => {
    if (!req.body.filekey) return res.status(400).json({ status: "'filekey' paramater is missing" })
    var filekeys = req.body.filekey.split(',')
    let requests = filekeys.map((eachKey) => {
        return new Promise((resolve, reject) => {
            var options = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: eachKey,
            };
            return S3DownloadFile(options, resolve, reject)
        });
    })
    Promise.all(requests).then((response) => {
        console.log(response,'done')
        res.attachment('file0')
        res.status(200).send(response)
    }).catch((response) =>{
        console.log(response)
        res.status(500).send(response)
    });
    console.log('line 70')

    next()

}


const S3DownloadFile = ((options, resolve, reject) => {
    s3bucket.getObject(options, ((err, data) => {
        if (err === null) {
            resolve({
                status: '200',
                fileName: options.Key,
                data : data.Body
            })
        } else {
            reject({
                error : err
            })
        }
    }))
})


const S3UploadFile = ((params) => {
    s3bucket.upload(params, ((err, data) => {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    }));
})

module.exports = { handleUpload, handleDownload, listFiles }