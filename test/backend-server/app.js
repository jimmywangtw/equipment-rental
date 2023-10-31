const express = require('express');
const app = express();
const cors = require('cors')


app.use(cors())
app.use(express.json())


let storedData = null
// 處理 POST 請求
app.post('/submit-form', (req, res) => {
    const formData = req.body; // 從請求主體中獲取表單數據
    storedData = formData
    console.log('Received form data:', formData);
    // 在這裡進行處理或存儲數據
    res.send('表單數據已成功接收');

});
//處理 GET 請求
app.get('/get-stored-data', (req, res) => {
    res.json(storedData)
})
// 設置端口號並啟動服務器
const port = 8000;
app.listen(port, () => {
    console.log(`Express 服務器正在監聽端口 ${port}`);
});