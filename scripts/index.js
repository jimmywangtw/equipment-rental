const endDateInput = document.querySelector("#end_date");
const startDateInput = document.querySelector("#start_date");
const dateSelect = document.querySelector(".date_select");
const rentalItems = document.querySelector("#rental_items");
const ul = document.querySelector("#rental_items");
const order = {
    order_id: "",
    user: { name: "", phone: "" },
    duration: { start_date: "start", end_date: "end" },
    items: [],
    price: 0,
}; // { order_id: "df4524", user:{name: "Kevin", phone: "0933445567"} duration: { start_date: "2023_10_22", end_date: "2023_10_29" }, items: [{item_id: "34243", quantity: 3}], price: 500 }

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
                //將日期值插入表單 ???????好像不需要 日期包含在order了
                // insertDateToForm();
                //顯示商品選擇標題
                showItemsSelectTitle();
                //購物車顯示租借時間
                showRentalDuration(startDateInput.value, endDateInput.value);
                //重整清單先清空現有的
                ul.innerHTML = "";
                data.products.map((product, key) => {
                    printItemsList(product, key);
                });
                console.log(data.products);
            })
            .catch((error) => console.error("錯誤：", error));
    }
}

// function insertDateToForm() {
//     //時間選擇放在form裡面會出錯所以出此下策
//     const hiddenStartDate = document.createElement("input");
//     hiddenStartDate.type = "hidden";
//     hiddenStartDate.name = "hiddenStartDate";
//     hiddenStartDate.value = startDateInput.value;
//     document.querySelector("form").appendChild(hiddenStartDate);

//     const hiddenEndDate = document.createElement("input");
//     hiddenEndDate.type = "hidden";
//     hiddenEndDate.name = "hiddenEndDate";
//     hiddenEndDate.value = endDateInput.value;
//     document.querySelector("form").appendChild(hiddenEndDate);
// }

function showDiffDays() {
    //計算日期差
    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    //顯示日期結果
    const totalDays = document.querySelector("#total_days");
    if (totalDays.children.length === 0) {
        const p = document.createElement("p");
        p.textContent = `共${diffDays}天`;
        totalDays.appendChild(p);
    } else {
        const p = totalDays.children[0];
        p.textContent = `共${diffDays}天`;
    }
}

function showItemsSelectTitle() {
    const h3 = document.querySelector(".rental_title");
    h3.textContent = "請選擇租借項目";
}

function showRentalDuration(start, end) {
    const cartDuration = document.querySelector(".cart_duration");
    cartDuration.textContent = `租借日期: ${start} ~ ${end}`;
}

function printItemsList(product, key) {
    const { title, stock } = product;

    const li = document.createElement("li");
    const buttonGroup = document.createElement("div");
    const itemInfo = document.createElement("div");
    const minusButton = document.createElement("button");
    const plusButton = document.createElement("button");
    const numberDisplay = document.createElement("span");

    let number = 0;

    minusButton.textContent = "-";
    plusButton.textContent = "+";
    numberDisplay.textContent = number;

    minusButton.addEventListener("click", () => {
        number = Math.max(0, number - 1); // 確保不會小於 0
        numberDisplay.textContent = number;
        handleItemObject(title, number);
        updateCart();
        orderValueToForm()
    });

    plusButton.addEventListener("click", () => {
        number = Math.min(stock, number + 1); // 確保不會大於庫存數量
        numberDisplay.textContent = number;
        handleItemObject(title, number);
        updateCart();
        orderValueToForm()
    });

    itemInfo.textContent = `${title}, 剩餘數量: ${stock}`;
    buttonGroup.appendChild(minusButton);
    buttonGroup.appendChild(numberDisplay);
    buttonGroup.appendChild(plusButton);

    li.appendChild(itemInfo);
    li.appendChild(buttonGroup);

    ul.appendChild(li);
}

function handleItemObject(title, number) {
    if (number > 0) {
        order.items[title] = number;
    } else {
        delete order.items[title];
    }
}

function updateCart() {
    const cartDiv = document.querySelector("#cart_list");
    cartDiv.innerHTML = "";
    for (const item in order.items) {
        const itemDiv = document.createElement("div");
        itemDiv.textContent = `${item} - ${order.items[item]}`;
        cartDiv.appendChild(itemDiv);
    }
}

function orderValueToForm() {
    document.getElementById('order_id').value = order.order_id;
    document.getElementById('user_name').value = order.user.name;
    document.getElementById('phone').value = order.user.phone;
    document.getElementById('start_date').value = order.duration.start_date;
    document.getElementById('end_date').value = order.duration.end_date;
    //document.getElementById('item_id').value = order.items[0].item_id;
    //document.getElementById('quantity').value = order.items[0].quantity;
    document.getElementById('price').value = order.price;
}

//設定時間欄位的最小日期
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const todayString = today.toISOString().split("T")[0];
const tomorrowString = tomorrow.toISOString().split("T")[0];

//時間選擇modal加上min屬性
document.querySelector("#start_date").setAttribute("min", todayString);
document.querySelector("#end_date").setAttribute("min", tomorrowString);

//兩個日期改變就抓資料
document
    .querySelector("#start_date")
    .addEventListener("change", fetchData);
document.querySelector("#end_date").addEventListener("change", fetchData);

document.querySelector("#rental_form").addEventListener("submit", function (e) {
    e.preventDefault()

    const jsonData = JSON.stringify(order)

    fetch(this.action, {
        method: this.method, body: jsonData, headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => console.log(res))
        .catch(err => console.error(err))
})
