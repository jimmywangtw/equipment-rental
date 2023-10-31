// ItemInfo 
// 產生item_id, 品名 包含不同規格, 數量, 價錢 包含不同天數不同價格, 圖片超連結放array, 

const editorForm = document.querySelector("#editor-form");

const itemInfo = {
    item_id: "",
    title: "",
    price: 0,
    quantity: 0,
    images: [],
    quillContent: "",
};

const toolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    ["bold", "italic", "underline", "strike"], // toggled buttons
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    ["blockquote", { list: "ordered" }, { list: "bullet" }],
    ["link"],
    [{ align: [] }],
    ["clean"], // remove formatting button
];
const quill = new Quill("#editor-container", {
    modules: { toolbar: toolbarOptions },
    theme: "snow",
});

function showMessageAndRedirect(message, time, redirectUrl) {
    document.body.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100vh;"><h1>${message}</h1></div>`;
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, time);
}

function submitForm(e) {
    e.preventDefault();
    console.log(quill.root.innerHTML)


    itemInfo.quillContent = JSON.stringify(quill.root.innerHTML)

    console.log(itemInfo.quillContent);
    const jsonData = JSON.stringify(itemInfo)

    fetch(this.action, {
        method: this.method,
        body: jsonData,
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => {
            console.log(res);
            // if (res.ok) {
            //     showMessageAndRedirect("修改成功 即將跳回首頁", 3000, "/");
            // }
        })
        .catch((err) =>
            // showMessageAndRedirect(`錯誤訊息: ${err} 即將跳回首頁`, 3000, "/")
            console.error(err)
        );
}
editorForm.addEventListener("submit", submitForm);

// ****test quill output*****
// const newDiv = document.createElement("div")
// newDiv.setAttribute("id", "output")
// document.querySelector("#quill-content").appendChild(newDiv)
// const output = document.querySelector("#output")
// output.textContent = "click me"
// output.addEventListener("click", () => {
//     fetch("http://localhost:8000/get-stored-data")
//         .then(res => res.json())
//         .then(data => {
//             const html = JSON.parse(data.quillContent)
//             output.innerHTML = html
//         })
// })

