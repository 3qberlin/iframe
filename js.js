const toke = "PRddnFpoPwOwsLxnTUe9usGkujN2";
const apiKey = "berlin/";
const customerUrl = "https://livejs-api.hexschool.io/api/livejs/v1/customer/";
const adminUrl = "https://livejs-api.hexschool.io/api/livejs/v1/admin/";

const productSelect = document.querySelector('.productSelect');

productSelect.addEventListener('change', function (e) {
    const onOption = e.target.value;
    console.log('onOption', onOption);
    getProduct(onOption);
})

window.onload = (function () {
    getProduct('全部')
})
const productWrap = document.querySelector('.productWrap');
// const productCategory = document.querySelector('.productCategory');
const shoppingCartTable = document.querySelector('.shoppingCart-table tbody');
const discardAllBtn = document.querySelector('.discardAllBtn');
console.log('shoppingCartTable');

let productData = [];
let cartData = [];
let ProObj = {};

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
                    <a href="#" class="addCardBtn js-addCart" id="${item.id}">加入購物車</a>
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
    if (addCartClass === null) {
        console.log('null');
        return;
    } else {
        const productId = e.target.getAttribute("id");
        addProductToCarts(productId);
    }
})

function addProductToCarts(id) {
    const obj = {
        data: {
            productId: id,
            quantity: 1
        }
    };
    axios.post(`${customerUrl}${apiKey}carts`, obj).then(function (res) {
        getCartList();
    }).catch(function (error) {
        console.log(error);
    })
}
function renderOptions() {
    let str = '';
    productData.forEach(function (item, index) {
        str += `
<option value="">${item.title}??</option>
`
    });
    productSelect.innerHTML = str;
}

function getCartList() {
    axios.get(`${customerUrl}${apiKey}carts`).then(function (res) {
        console.log('res', res);
        cartData = res.data.carts;
        console.log('cartData', cartData);
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
                        <td>1</td>
                        <td>NT$${item.product.price}</td>
                        <td class="discardBtn">
                            <span class="material-icons deleteThis" id="${item.id}">
                                clear
                            </span>
                        </td>
                    </tr>
                   

                `
        });
        shoppingCartTable.innerHTML = str;
    }).catch(function (error) {
        console.log(error);
    })
}

shoppingCartTable.addEventListener('click', function (e) {
    e.preventDefault;
    console.log(e.target.getAttribute('class'));
    const targetClass = e.target.getAttribute('class');
    console.log('targetClass', targetClass);
    if (targetClass === null) {
        console.log('沒有點到');
        return;
    } else if (targetClass === "material-icons deleteThis") {
        console.log('點到了');
        const productId = e.target.getAttribute("id");
        console.log('productId', productId);
        deleteOneProduct(productId);
    }
})

discardAllBtn.addEventListener('click', function () {
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
            console.log(result);
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'You did it',
                    text: 'I\'m new alert',
                })
                deleteAllCarts();
            }
        })
    })
});

function deleteAllCarts() {
    axios.delete(`${customerUrl}${apiKey}carts`).then(function (res) {
        console.log('delete ok');
        getCartList();

    }).catch(function (error) {
        console.log(error);

    })
}

function deleteOneProduct(id) {
    axios.delete(`${customerUrl}${apiKey}carts/${id}`).then(function (res) {
        console.log('delete ok');
        getCartList();
    }).catch(function (error) {
        console.log(error);
    })
}
function init() {
    getProductList();
    getCartList();
}

init();