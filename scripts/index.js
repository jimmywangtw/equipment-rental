//新增第三方登入

const endDateInput = document.querySelector("#end-date");
const startDateInput = document.querySelector("#start-date");
const userNameInput = document.querySelector("#user-name")
const phoneInput = document.querySelector("#phone")
const dateSelect = document.querySelector(".date-select");
const rentalItems = document.querySelector("#rental-items");
const rentalTitle = document.querySelector(".rental-title");
const totalDays = document.querySelector("#total-days");
const cartDuration = document.querySelector(".cart-duration");
const cartDiv = document.querySelector("#cart-list");
const cartTotalPrice = document.querySelector("#total-price")

const order = {
    order_id: "",
    user: { name: "", phone: "" },
    duration: { start_date: "start", end_date: "end" },
    items: [],
    total_price: 0,
}; // { order-id: "df4524", user:{name: "Kevin", phone: "0933445567"} duration: { start-date: "2023-10-22", end-date: "2023-10-29" }, items: [{title: "ice-claw", quantity: 3, price: 300}], total-price: 900 }]}

function fetchData() {
    const dataURL = "https://dummyjson.com/products";


    if (startDateInput.value && endDateInput.value) {
        //更新訂單租借日期
        order.duration.start_date = startDateInput.value
        order.duration.end_date = endDateInput.value

        fetch(dataURL)
            .then((response) => response.json())
            .then((data) => {
                //顯示總租借日期
                showDiffDays();
                //顯示商品選擇標題
                showItemsSelectTitle();
                //購物車顯示租借時間
                showRentalDuration(startDateInput.value, endDateInput.value);
                //重整清單先清空現有的
                rentalItems.innerHTML = "";

                data.products.map((product) => printItemsList(product));
                console.log(data.products);
            })
            .catch((error) => console.error("錯誤：", error));
    }
}

function generateOrderNumber() {
    const prefix = "ORD"; // 自定義前綴
    const date = new Date();
    const timestamp = date.getTime(); // 獲取時間戳記
    const random = Math.floor(Math.random() * 10000); // 隨機數

    const orderNumber = `${prefix}-${timestamp}-${random}`; // 組合唯一的訂單號

    return orderNumber;
}

function showDiffDays() {
    //計算日期差
    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    //顯示日期結果
    totalDays.textContent = `共${diffDays}天`
}

function showItemsSelectTitle() {
    rentalTitle.textContent = "請選擇租借項目";
}

function showRentalDuration(start, end) {
    cartDuration.textContent = `租借日期: ${start} ~ ${end}`;
}

function printItemsList(product) {
    const { title, stock, price } = product;

    const li = document.createElement("li");
    const buttonGroup = document.createElement("div");
    const itemInfo = document.createElement("div");
    const minusButton = document.createElement("button");
    const plusButton = document.createElement("button");
    const numberDisplay = document.createElement("span");

    let quantity = 0;

    minusButton.textContent = "-";
    plusButton.textContent = "+";
    numberDisplay.textContent = quantity;

    minusButton.addEventListener("click", () => {
        quantity = Math.max(0, quantity - 1); // 確保不會小於 0
        numberDisplay.textContent = quantity;
        handleItemObject(title, quantity, price);
        updateCart();

    });

    plusButton.addEventListener("click", () => {
        quantity = Math.min(stock, quantity + 1); // 確保不會大於庫存數量
        numberDisplay.textContent = quantity;
        handleItemObject(title, quantity, price);
        updateCart();
    });

    itemInfo.textContent = `${title}, 剩餘數量: ${stock}, 租賃費用: ${price}`;
    buttonGroup.appendChild(minusButton);
    buttonGroup.appendChild(numberDisplay);
    buttonGroup.appendChild(plusButton);

    li.appendChild(itemInfo);
    li.appendChild(buttonGroup);

    rentalItems.appendChild(li);
}

function handleItemObject(title, quantity, price) {
    if (quantity > 0) {
        const existingItem = order.items.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity = quantity;
            existingItem.price = price * quantity
        } else {
            order.items.push({ title, quantity, price });
        }
    } else {
        order.items = order.items.filter(item => item.title !== title);
    }
}

function updateCart() {
    cartDiv.innerHTML = "";

    for (const item of order.items) {
        const itemDiv = document.createElement("div");
        itemDiv.textContent = `${item.title} - ${item.quantity}, ${item.price}元`;
        cartDiv.appendChild(itemDiv);
    }
    calculateTotalPrice()
    orderValueToForm()
}

function calculateTotalPrice() {
    let totalPrice = order.items.reduce((acc, curr) => acc + curr.price, 0)
    order.total_price = totalPrice
    cartTotalPrice.textContent = `共${totalPrice}元`
}
function orderValueToForm() {
    document.getElementById('order-id').value = order.order_id;
    document.getElementById('start-date').value = order.duration.start_date;
    document.getElementById('end-date').value = order.duration.end_date;
    document.getElementById('items').value = order.items;
}


function submitForm(e) {
    e.preventDefault()
    const orderID = generateOrderNumber()
    order.order_id = orderID
    const jsonData = JSON.stringify(order)

    fetch(this.action, {
        method: this.method,
        body: jsonData,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            console.log(res)
            if (res.ok) {
                showMessageAndRedirect("訂單成功送出 即將跳回首頁", 3000, "/")
            }
        })
        .catch(err => showMessageAndRedirect(`錯誤訊息: ${err} 即將跳回首頁`, 3000, "/"))
}

function showMessageAndRedirect(message, time, redirectUrl) {
    document.body.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100vh;"><h1>${message}</h1></div>`;
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, time);
}
//設定時間欄位的最小日期
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const todayString = today.toISOString().split("T")[0];
const tomorrowString = tomorrow.toISOString().split("T")[0];

//時間選擇modal加上min屬性
startDateInput.setAttribute("min", todayString);
endDateInput.setAttribute("min", tomorrowString);

//兩個日期改變就抓資料
startDateInput.addEventListener("change", fetchData);
endDateInput.addEventListener("change", fetchData);

//監聽使用者名稱 電話
userNameInput.addEventListener("input", (e) => order.user.name = e.target.value)
phoneInput.addEventListener("input", (e) => order.user.phone = e.target.value)

document.querySelector("#rental-form").addEventListener("submit", submitForm)
