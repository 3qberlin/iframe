

function c3Fn() {
    // C3.js
    let c3Obj = {}
    orderData.forEach(function(item,index){
        item.products.forEach(function(productCategory,productIndex){
            if(c3Obj[productCategory.category] === undefined){
                c3Obj[productCategory.category] = productCategory.price * productCategory.quantity
            }else{
                c3Obj[productCategory.category] += productCategory.price * productCategory.quantity
            }
        })
    });
    let categoryAry = Object.keys(c3Obj);
    let newData = [];
    categoryAry.forEach(function(item){
        let ary = [];
        ary.push(item);
        ary.push(c3Obj[item]);
        newData.push(ary);
    })

    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns:newData,
            colors: {
                "Louvre 雙人床架": "#DACBFF",
                "Antony 雙人床架": "#9D7FEA",
                "Anty 雙人床架": "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
}

const token = "PRddnFpoPwOwsLxnTUe9usGkujN2";
const apiKey = "berlin/";
const adminUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin/";

const tbody = document.querySelector('tbody');
const discardAllBtn = document.querySelector('.discardAllBtn');

let orderData = [];

function init() {
    getOrderList();
}

init();

function getOrderList() {
    axios.get(`${adminUrl}${apiKey}orders`, {
        headers: {
            authorization: token
        }
    }).then(function (res) {
        orderData = res.data.orders;
        let tableContent = '';
        let tradeStatus = '';
        let updatedOrders = orderData.map(order => {
            order.createdAt = order.createdAt * 1000;
            return order;
        });
        updatedOrders.forEach(function (item, index) {
            // 調整日期格式
            const formattedDate = new Date(item.createdAt);
            const year = formattedDate.getFullYear();
            const month = formattedDate.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            const day = formattedDate.getDate();
            // 處理訂單品項
            let productContent = '';
            item.products.forEach(function (productItem, index) {
                productContent += `
                ${productItem.title} x ${productItem.quantity}<br>
                `
            })
            // 處理訂單狀態
            if (item.paid === true) {
                tradeStatus = '已付清'
            } else {
                tradeStatus = '未付款'
            }
            tableContent +=
                `
            <tr>
            <td>${item.id}</td>
            <td>
                <p>${item.user.name}</p>
                
            </td>
            <td><p>${item.user.tel}</p></td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
                <p>
                ${productContent}
                </p>
            </td>
            <td>${year}/${month}/${day}</td>
            <td class="orderStatus" >
                <a href="#" class="table-a" data-idS="${item.id}">${tradeStatus}</a>
            </td>
            <td>
                <input type="button" class="delSingleOrder-Btn" value="刪除" data-id="${item.id}">
            </td>
        </tr>
            `
        })
        tbody.innerHTML = tableContent;
        c3Fn();
    })
}

tbody.addEventListener('click', function (e) {
    el = e.target.getAttribute('class');
    elText = e.target.textContent;

    if (el === 'delSingleOrder-Btn') {
        targetId = e.target.getAttribute('data-id');
        deleteOneProduct(targetId);
    } else if (el === 'table-a') {
        targetStatus = e.target.getAttribute('class');
        statusId = e.target.getAttribute('data-ids');
        if (elText === '未付款') {
            paidStatus = true
        } else if (elText === '已付清') {
            paidStatus = false
        }
        let statusData = {
            data: {
                id: statusId,
                paid: paidStatus
            }
        }
        changeTradeStatus(statusData);
    } else {
        return;
    }
})

function deleteOneProduct(id) {
    axios.delete(`${adminUrl}${apiKey}orders/${id}`, {
        headers: {
            authorization: token
        }
    }).then(function (res) {
        init();
    }).catch(function (error) {
        console.log(error);
    })
}

function deleteAllProduct() {
    axios.delete(`${adminUrl}${apiKey}orders`, {
        headers: {
            authorization: token
        }
    }).then(function (res) {
        init();
    }).catch(function (error) {
        console.log(error);
    })
}

discardAllBtn.addEventListener('click', function () {
    deleteAllProduct();
})

function changeTradeStatus(data) {
    axios.put(`${adminUrl}${apiKey}orders`, data, {
        headers: {
            authorization: token
        }
    }).then(function (res) {
        init();
        console.log('data', data);
    }).catch(function (error) {
        console.log(error);
    })
}