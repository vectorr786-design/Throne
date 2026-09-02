let selectedPass = "";

let orders = loadOrders();

const ADMIN_USER = "TOW_ADMIN";
const ADMIN_PASS = "T!hrone_2026#War";


function loadOrders(){

    try{

        const data =
            localStorage.getItem("TOW_ORDERS");

        if(!data) return [];

        const parsed = JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed
            : [];

    }catch(error){

        console.error(error);
        return [];
    }
}


function saveOrders(){

    localStorage.setItem(
        "TOW_ORDERS",
        JSON.stringify(orders)
    );
}


function selectPass(type){

    selectedPass = type;

    const text =
        type === "NORMAL"
        ? "NORMAL — ۱۸۹,۰۰۰ تومان"
        : "PREMIUM — ۲۴۹,۰۰۰ تومان";

    document.getElementById("selectedPass")
        .textContent = text;

    const box =
        document.getElementById("playerBox");

    box.style.display = "block";

    box.scrollIntoView({
        behavior:"smooth",
        block:"center"
    });
}


function continuePurchase(){

    const country =
        document.getElementById("country")
        .value.trim();

    const playerId =
        document.getElementById("playerId")
        .value.trim();

    if(!selectedPass){

        alert("ابتدا Battle Pass را انتخاب کنید.");
        return;
    }

    if(!country || !playerId){

        alert("نام کشور و Player ID را وارد کنید.");
        return;
    }

    const price =
        selectedPass === "NORMAL"
        ? "۱۸۹,۰۰۰ تومان"
        : "۲۴۹,۰۰۰ تومان";

    document.getElementById("orderSummary")
        .innerHTML = `
            <div class="selected-pass">
                <div>Battle Pass:
                    <b>${escapeHTML(selectedPass)}</b>
                </div>

                <div>Country:
                    <b>${escapeHTML(country)}</b>
                </div>

                <div>Player ID:
                    <b>${escapeHTML(playerId)}</b>
                </div>

                <div>Price:
                    <b>${price}</b>
                </div>
            </div>
        `;

    document.getElementById("paymentBox")
        .style.display = "block";

    document.getElementById("paymentBox")
        .scrollIntoView({
            behavior:"smooth",
            block:"center"
        });
}


function previewReceipt(){

    const input =
        document.getElementById("receipt");

    const preview =
        document.getElementById("preview");

    preview.innerHTML = "";

    const file = input.files[0];

    if(!file) return;

    if(!file.type.startsWith("image/")){

        alert("فقط فایل تصویری انتخاب کنید.");
        input.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event){

        preview.innerHTML =
            `<img src="${event.target.result}"
                  alt="Receipt">`;
    };

    reader.readAsDataURL(file);
}


function submitOrder(){

    const country =
        document.getElementById("country")
        .value.trim();

    const playerId =
        document.getElementById("playerId")
        .value.trim();

    const file =
        document.getElementById("receipt")
        .files[0];

    if(!country || !playerId){

        alert("اطلاعات بازیکن کامل نیست.");
        return;
    }

    if(!file){

        alert("تصویر رسید را انتخاب کنید.");
        return;
    }

    if(file.size > 5 * 1024 * 1024){

        alert("حجم تصویر باید کمتر از ۵ مگابایت باشد.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(event){

        const order = {

            id:
                "TOW-" + Date.now(),

            country:
                country,

            playerId:
                playerId,

            pass:
                selectedPass,

            price:
                selectedPass === "NORMAL"
                ? "۱۸۹,۰۰۰ تومان"
                : "۲۴۹,۰۰۰ تومان",

            receipt:
                event.target.result,

            status:
                "در انتظار بررسی",

            date:
                new Date().toLocaleString("fa-IR")
        };

        orders.push(order);

        saveOrders();

        alert(
            "سفارش با موفقیت ثبت شد."
        );

        resetPurchase();
    };

    reader.readAsDataURL(file);
}


function resetPurchase(){

    document.getElementById("country").value = "";

    document.getElementById("playerId").value = "";

    document.getElementById("receipt").value = "";

    document.getElementById("preview").innerHTML = "";

    document.getElementById("playerBox")
        .style.display = "none";

    document.getElementById("paymentBox")
        .style.display = "none";

    selectedPass = "";
}


function openAdmin(){

    document.getElementById("adminModal")
        .style.display = "flex";

    document.getElementById("loginError")
        .textContent = "";
}


function closeAdmin(){

    document.getElementById("adminModal")
        .style.display = "none";
}


function loginAdmin(){

    const user =
        document.getElementById("adminUser")
        .value.trim();

    const pass =
        document.getElementById("adminPass")
        .value;

    if(
        user === ADMIN_USER &&
        pass === ADMIN_PASS
    ){

        closeAdmin();

        document.getElementById("adminPanel")
            .style.display = "block";

        loadOrders();

        document.getElementById("adminPanel")
            .scrollIntoView({
                behavior:"smooth"
            });

    }else{

        document.getElementById("loginError")
            .textContent =
            "نام کاربری یا رمز عبور اشتباه است.";
    }
}


function loadOrders(){

    orders = loadOrdersFromStorage();

    const container =
        document.getElementById("orders");

    if(!orders.length){

        container.innerHTML = `
            <div class="empty">
                هنوز سفارشی ثبت نشده است.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    orders.forEach((order,index)=>{

        const div =
            document.createElement("div");

        div.className = "order";

        div.innerHTML = `

            <h3>
                ${escapeHTML(order.pass)}
                BATTLE PASS
            </h3>

            <p>
                کشور:
                ${escapeHTML(order.country)}
            </p>

            <p>
                Player ID:
                ${escapeHTML(order.playerId)}
            </p>

            <p>
                مبلغ:
                ${escapeHTML(order.price)}
            </p>

            <p>
                وضعیت:
                ${escapeHTML(order.status)}
            </p>

            <p>
                Order ID:
                ${escapeHTML(order.id)}
            </p>

            <p>
                تاریخ:
                ${escapeHTML(order.date)}
            </p>

            ${
                order.receipt
                ?
                `<img src="${order.receipt}"
                      alt="Receipt">`
                :
                ""
            }

            <div class="actions">

                <button
                    class="approve"
                    onclick="approveOrder(${index})">
                    تأیید
                </button>

                <button
                    class="reject"
                    onclick="rejectOrder(${index})">
                    رد
                </button>

                <button
                    class="copy"
                    onclick="copyOrder(${index})">
                    کپی سفارش
                </button>

            </div>
        `;

        container.appendChild(div);
    });
}


function loadOrdersFromStorage(){

    try{

        const data =
            localStorage.getItem("TOW_ORDERS");

        if(!data) return [];

        const parsed = JSON.parse(data);

        return Array.isArray(parsed)
            ? parsed
            : [];

    }catch(error){

        return [];
    }
}


function approveOrder(index){

    orders[index].status = "تأیید شد";

    saveOrders();

    loadOrders();
}


function rejectOrder(index){

    orders[index].status = "رد شد";

    saveOrders();

    loadOrders();
}


function copyOrder(index){

    const order = orders[index];

    const text =
`THRONE OF WAR
Order ID: ${order.id}
Country: ${order.country}
Player ID: ${order.playerId}
Battle Pass: ${order.pass}
Price: ${order.price}
Status: ${order.status}
Date: ${order.date}`;

    if(
        navigator.clipboard &&
        navigator.clipboard.writeText
    ){

        navigator.clipboard.writeText(text)
            .then(()=>{
                alert("اطلاعات سفارش کپی شد.");
            })
            .catch(()=>{
                fallbackCopy(text);
            });

    }else{

        fallbackCopy(text);
    }
}


function fallbackCopy(text){

    const area =
        document.createElement("textarea");

    area.value = text;

    document.body.appendChild(area);

    area.select();

    document.execCommand("copy");

    area.remove();

    alert("اطلاعات سفارش کپی شد.");
}


function logout(){

    document.getElementById("adminPanel")
        .style.display = "none";
}


function escapeHTML(value){

    return String(value)
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}