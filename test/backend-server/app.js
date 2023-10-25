const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors())
app.use(express.json())


// 處理 POST 請求
app.post('/submit-form', (req, res) => {
    const formData = req.body; // 從請求主體中獲取表單數據
    console.log('Received form data:', formData);
    // 在這裡進行處理或存儲數據
    res.send('表單數據已成功接收');

});

// 設置端口號並啟動服務器
const port = 3000;
app.listen(port, () => {
    console.log(`Express 服務器正在監聽端口 ${port}`);
});