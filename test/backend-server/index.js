const express = require('express');
const path = require('path');
const app = express();

// 將靜態文件目錄設置為包含 index.html 的目錄
app.use(express.static(path.join(__dirname, 'test')));

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});