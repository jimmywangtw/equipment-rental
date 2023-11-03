// ItemInfo 
// 產生item_id, 品名 包含不同規格, 數量, 價錢, 圖片超連結放array, 
// 分頁
// 讀取訂單

const editorForm = document.querySelector("#editor-form");
const title = document.querySelector("#title")
const imagesContainer = document.querySelector("#images-container")
const spec = document.querySelector("#spec")
const price = document.querySelector("#price")
const stock = document.querySelector("#stock")
const quillContent = document.querySelector("#quill-content")
const specContainer = document.querySelector("#spec-container")

title.addEventListener("input", (e) => itemInfo.title = e.target.value)
spec.addEventListener("input", (e) => specObj.spec_name = e.target.value)
price.addEventListener("input", (e) => specObj.price = e.target.value)
stock.addEventListener("input", (e) => specObj.stock = e.target.value)
quillContent.addEventListener("input", (e) => itemInfo.description = e.target.value)
imagesContainer.addEventListener('input', checkImagesInput);

const itemInfo = {
    title: "",
    spec: [],
    images: [],
    quill_content: ""
};

const specObj = {
    item_id: "",
    spec_name: "",
    price: 0,
    stock: 0,
}

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

const quill = new Quill("#quill-content", {
    modules: { toolbar: toolbarOptions },
    theme: "snow",
});




function checkImagesInput() {
    const imageInputArr = Array.from(document.querySelectorAll(".image"))
    const emptyInputs = imageInputArr.filter(input => input.value === "")


    if (emptyInputs.length === 0) {
        addImageInput()
    }

}

function addImageInput() {
    const newInput = document.createElement("input")
    let imagesInputCount = 1

    newInput.type = "url"
    newInput.name = "image" + (++imagesInputCount)
    newInput.className = "image"
    newInput.placeholder = "請輸入圖片網址"

    imagesContainer.appendChild(newInput)
    imagesContainer.appendChild(document.createElement("br"))
    imagesContainer.appendChild(document.createElement("br"))
}


function addSpecDiv() {
    let specInputCount = 2
    const newDiv = document.createElement("div")


    newDiv.innerHTML = `        
    <div class="spec-inputs">
        <label for="spec${specInputCount}">規格：</label><br />
        <input type="text" id="spec" name="spec${specInputCount}" /><br /><br />

        <label for="price${specInputCount}">價格：</label><br />
        <input type="number" id="price" name="price${specInputCount}" /><br /><br />

        <label for="stock${specInputCount}">庫存：</label><br />
        <input type="number" id="stock" name="stock${specInputCount}" /><br /><br /><br />

    </div>
`;

    specInputCount++
    specContainer.appendChild(newDiv)
}

function showMessageAndRedirect(message, time, redirectUrl) {
    document.body.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100vh;"><h1>${message}</h1></div>`;
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, time);
}

function submitForm(e) {
    e.preventDefault();

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

