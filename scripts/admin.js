// ItemInfo 
// 產生item_id, 品名 包含不同規格, 數量, 價錢, 圖片超連結放array, 
// 分頁
// 讀取訂單

const editorForm = document.querySelector("#editor-form");
const title = document.querySelector("#title")
const imagesContainer = document.querySelector("#images-container")
const quillContent = document.querySelector("#quill-content")
const specContainer = document.querySelector("#spec-container")
const specInputsButton = document.querySelector(".spec-inputs-button")

title.addEventListener("input", (e) => itemInfo.title = e.target.value)
quillContent.addEventListener("input", (e) => itemInfo.description = e.target.value)
imagesContainer.addEventListener('input', checkImagesInput);
specInputsButton.addEventListener("click", addSpecDiv)
editorForm.addEventListener("submit", submitForm);

const itemInfo = {
    title: "",
    specs: [],
    images: [],
    quill_content: ""
};

// quill section
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



// function section
function checkImagesInput() {
    const imageInputArr = Array.from(document.querySelectorAll(".image"))
    const emptyInputs = imageInputArr.filter(input => input.value === "")


    if (emptyInputs.length === 0) {
        addImageInput()
    }

}

function addImageInput() {
    const newInput = document.createElement("input")


    newInput.type = "url"
    newInput.name = "image"
    newInput.className = "image"
    newInput.placeholder = "請輸入圖片網址"

    imagesContainer.appendChild(newInput)
    imagesContainer.appendChild(document.createElement("br"))
    imagesContainer.appendChild(document.createElement("br"))
}

function addImagesToArr() {
    const inputs = document.querySelectorAll(".image")
    inputs.forEach(input => {
        const url = input.value
        if (url) {
            itemInfo.images.push(url)
        }
    })
}

function addSpecDiv(e) {
    e.preventDefault()

    const newDiv = document.createElement("div")
    newDiv.className = "spec-inputs"

    newDiv.innerHTML = `        
    <label
    >規格：
    <input
      type="text"
      class="spec"
      name="spec"
      aria-label="specification"
      title="specification"
      placeholder="請輸入規格" /></label
  ><br /><br />

  <label
    >價格：
    <input
      type="number"
      class="price"
      name="price"
      aria-label="price"
      title="price"
      placeholder="請輸入價格"
    /> </label
  ><br /><br />

  <label
    >庫存：
    <input
      type="number"
      class="stock"
      name="stock"
      aria-label="stock"
      title="stock"
      placeholder="請輸入庫存"
    /> </label
  ><br /><br /><br />
`;

    specContainer.appendChild(newDiv)
}

function addSpecObjToArr() {
    const inputs = document.querySelectorAll(".spec-inputs")
    inputs.forEach(input => {
        const spec = input.querySelector('.spec').value;
        const price = input.querySelector('.price').value;
        const stock = input.querySelector('.stock').value;
        const obj = { spec, price, stock };
        itemInfo.specs.push(obj);
    })
}

function showMessageAndRedirect(message, time, redirectUrl) {
    document.body.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100vh;"><h1>${message}</h1></div>`;
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, time);
}

function submitForm(e) {
    e.preventDefault();

    addImagesToArr()
    addSpecObjToArr()
    itemInfo.quill_content = quill.root.innerHTML

    const jsonData = JSON.stringify(itemInfo)

    console.log(jsonData)
    return false;

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

