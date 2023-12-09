const apiKey = "berlin/";
const customerUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";

window.onload = (function () {
    getProduct('全部')
})

const productSelect = document.querySelector('.productSelect');
const productWrap = document.querySelector('.productWrap');
const thead = document.querySelector('.shoppingCart-table thead');
const tbody = document.querySelector('.shoppingCart-table tbody');
const tfoot = document.querySelector('.shoppingCart-table tfoot');
const discardAllBtn = document.querySelector('.discardAllBtn');
const totalCost = document.querySelector('.totalCost');
const customerName = document.getElementById('customerName');
const customerPhone = document.getElementById('customerPhone');
const customerEmail = document.getElementById('customerEmail');
const customerAddress = document.getElementById('customerAddress');
const customerTradeWay = document.getElementById('tradeWay');
const submit = document.querySelector('.submit');
const nameNotice = document.querySelector('[data-message="姓名"]');
const phoneNotice = document.querySelector('[data-message="電話"]');
const emailNotice = document.querySelector('[data-message="Email"]');
const addressNotice = document.querySelector('[data-message="寄送地址"]');
const form = document.querySelector('form');

let productData = [];
let cartData = [];
let ProObj = {};

productSelect.addEventListener('change', function (e) {
    const onOption = e.target.value;
    getProduct(onOption);
})

submit.addEventListener('click', function (e) {
    e.preventDefault();
    let customerNameVal = customerName.value;
    let customerPhoneVal = customerPhone.value;
    let customerEmailVal = customerEmail.value;
    let customerAddressVal = customerAddress.value;
    let customerTradeWayVal = customerTradeWay.value;
    let userData = {
        data: {
            user: {
                name: customerNameVal,
                tel: customerPhoneVal,
                email: customerEmailVal,
                address: customerAddressVal,
                payment: customerTradeWayVal
            }
        }
    };
    if (customerNameVal && customerPhoneVal && customerEmailVal && customerAddressVal && customerTradeWayVal !== '') {
        let url = `${customerUrl}${apiKey}orders`
        axios
            .post(
                url,
                userData
            )
            .then(function (res) {
                form.reset();
                getCartList();
                Swal.fire("訂購成功 o(^▽^)o");
            })
            .catch(function (error) {
                Swal.fire("請將商品加入購物車 或 填寫完整預訂資料 (^～^;)ゞ");
                console.error("訂單資訊失敗", error.response);
            });
    } else {
        Swal.fire("請完整填妥所有資料");
        return;
    }
})


function getProduct(onOption) {
    let url = `${customerUrl}${apiKey}products`;
    axios.get(url)
        .then(function (res) {
            productData = res.data.products;
            console.log('productData', productData);
            if (!ProObj[onOption]) {
                ProObj[onOption] = productData.filter(item => item.category === onOption)
            }
            renderProduct(onOption === '全部' ? productData : ProObj[onOption]);
            getCartList();
        })
        .catch(function (error) {
            console.log(error);
        })
}

function renderProduct(product) {
    let str = '';
    product.forEach((item) => {
        str += `
                    <li class="productCard">
                    <h4 class="productType">新品</h4>
                    <img src="${item.images}"
                        alt="">
                    <a href="#" class="js-addCart" id="${item.id}">加入購物車</a>
                    <h3>${item.title}</h3>
                    <del class="originPrice">NT$${item.origin_price}</del>
                    <p class="nowPrice">NT$${item.price}</p>
                </li>
    `
    })
    productWrap.innerHTML = str;
}

productWrap.addEventListener('click', function (e) {
    const addCartClass = e.target.getAttribute("class");
    if (addCartClass !== 'js-addCart') {
        return;
    } else {
        const productId = e.target.getAttribute("id");

        const obj = {
            data: {
                productId: productId,
                quantity: 1
            }
        };
        addProductToCarts(obj);
    }
})

function addProductToCarts(obj) {
 


    axios.post(`${customerUrl}${apiKey}carts`, obj).then(function (res) {
        let resData = res;

        Swal.fire("加入購物車成功 ✧◝(⁰▿⁰)◜✧");
        getCartList();
    }).catch(function (error) {
        console.log(error);
    })


}

function renderOptions() {
    let str = '';
    productData.forEach(function (item, index) {
        str += `
<option value="">${item.title}</option>
`
    });
    productSelect.innerHTML = str;
}

function getCartList() {
    axios.get(`${customerUrl}${apiKey}carts`).then(function (res) {
        cartData = res.data.carts;
        let str = '';
        cartData.forEach(function (item, index) {
            str += `
                    <tr>
                        <td>
                            <div class="cardItem-title">
                                <img src="${item.product.images}" alt="product">
                                <p>${item.product.title}</p>
                            </div>
                        </td>
                        <td>NT$${item.product.price}</td>
                        <td>${item.quantity}</td>
                        <td>NT$${item.product.price}</td>
                        <td class="discardBtn">
                            <span class="material-icons deleteThis" id="${item.id}">
                                clear
                            </span>
                        </td>
                    </tr>
                `
        });
        tbody.innerHTML = str;
        let str3 = '';
        let totalCostCount = 0;
        cartData.forEach(function (item, index) {
            totalCostCount += parseInt(item.product.price);
            return;
        })
        if (cartData.length >= 1) {
            cartData.forEach(function (item, index) {
                str2 = `
                <th width="40%">品項</th>
                <th width="15%">單價</th>
                <th width="15%">數量</th>
                <th width="15%">金額</th>
                <th width="15%"></th>
            </tr>
                `
                str3 = `
                <tr>
                <td>
                    <a href="#" class="discardAllBtn">刪除所有品項</a>
                </td>
                <td></td>
                <td></td>
                <td>
                    <p>總金額</p>
                </td>
                <td>NT${totalCostCount}</td>
            </tr>
                `
            })
            tfoot.innerHTML = str3;
        } else {
            tfoot.innerHTML = '<p class="text-align:center;width:100%;">挑個產品吧 ✧*｡٩(ˊᗜˋ*)و✧*｡</p>';
            thead.innerHTML = '';
        }
    }).catch(function (error) {
        console.log(error);
    })
}

tbody.addEventListener('click', function (e) {
    e.preventDefault;
    const targetClass = e.target.getAttribute('class');
    if (targetClass === null) {
        return;
    } else if (targetClass === "material-icons deleteThis") {
        const productId = e.target.getAttribute("id");
        deleteOneProduct(productId);
    }
})

tfoot.addEventListener('click', function (e) {
    tfootStatus = e.target.getAttribute('class');
    if (tfootStatus !== 'discardAllBtn') {
        return;
    } else {
        axios.get(`${customerUrl}${apiKey}carts`).then(function (res) {
            cartData = res.data.carts;
            if (cartData.length <= 0) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "購物車無任何產品"
                });
                return;
            } Swal.fire({
                icon: 'question',
                title: '清空購物車',
                text: '請確認是否清空？',
                showCancelButton: true,
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        icon: 'success',
                        title: '成功刪除 (´･ω･`)  '
                    })
                    deleteAllCarts();
                }
            })
        }).catch(function (error) {
            console.log(error);
        });
    }
})

function deleteAllCarts() {
    axios.delete(`${customerUrl}${apiKey}carts`).then(function (res) {
        getCartList();

    }).catch(function (error) {
        console.log(error);
    })
}

function deleteOneProduct(id) {
    axios.delete(`${customerUrl}${apiKey}carts/${id}`).then(function (res) {
        getCartList();
    }).catch(function (error) {
        console.log(error);
    })
}

customerName.addEventListener('input', function () {
    const customerNameVal = this.value.trim();
    if (customerNameVal !== '') {
        nameNotice.style.display = 'none';
    } else {
        nameNotice.style.display = 'block';
    }
});
customerPhone.addEventListener('input', function () {
    const customerPhoneVal = this.value.trim();
    if (customerPhoneVal !== '') {
        phoneNotice.style.display = 'none';
    } else {
        phoneNotice.style.display = 'block';
    }
});
customerEmail.addEventListener('input', function () {
    const customerEmailVal = this.value.trim();
    if (customerEmailVal !== '') {
        emailNotice.style.display = 'none';
    } else {
        emailNotice.style.display = 'block';
    }
});
customerAddress.addEventListener('input', function () {
    const customerAddressVal = this.value.trim();
    if (customerAddressVal !== '') {
        addressNotice.style.display = 'none';
    } else {
        addressNotice.style.display = 'block';
    }
});

function init() {
    getCartList();
}

init();