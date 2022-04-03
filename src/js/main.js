window.onload = function () {
    document.getElementById("loading").style.display = "none";
}

const gridViewButton = document.querySelector('.grid-btn');
const listViewButton = document.querySelector('.list-btn');
const products = document.getElementById('products');

function initSwitchLayout() {
    listViewButton.onclick = function () {
        products.classList.add('list-view');
    }

    gridViewButton.onclick = function () {
        products.classList.remove('list-view');
    }
}

function initRemoveListViewOnMobile() {
    if (window.matchMedia('(max-width: 567px)').matches) {
        products.classList.remove('list-view');
        listViewButton.parentNode.classList.remove('active');
        gridViewButton.parentNode.classList.add('active');
    }
}

function initActiveBtnLayout() {
    let dropDowns = Array.from(document.querySelectorAll('.switch-layout li'));

    dropDowns.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();

            dropDowns.forEach(el => {
                el.classList.remove('active');
            });

            e.currentTarget.classList.add('active');
        })
    });
}

initSwitchLayout();
initActiveBtnLayout();
initRemoveListViewOnMobile();

window.addEventListener('resize', initRemoveListViewOnMobile);





let requestURL = './assets/other/products.json';
let request = new XMLHttpRequest();

request.open("GET", requestURL, false);
request.overrideMimeType("application/json");
request.send(null);


let jsonData = JSON.parse(request.responseText);
let dataList = jsonData;

if (dataList.response_code === 200) {
    delete dataList["response_code"];
} else {
    alert('There was a problem with the request.');
}

let arr = [];

for (const [key, value] of Object.entries(dataList)) {
    let arrStatus = [];
    arrStatus.push(value.prod_status);
    let


        newArr = arrStatus[0].split(',')

    for (let i = 0; i < 2; i++) {
        if (!(newArr[i] == undefined) && !(newArr[i] == '')) {
            arr.push(newArr[i])
        }
    }

    let product =
        `<div class="product">
            <div class="product__image">
                <img src="assets/img/img-placeholder.jpg" alt="image description" srcset="assets/img/img-placeholder@2x.jpg 2x">
                    ${!(newArr[0] == '') ? 
                `<ul class="status">
                    ${(newArr.length == 2) ? 
                    `<li>
                        ${newArr[0]}
                     </li>
                     <li>
                        ${newArr[1]}
                     </li>`
                     : 
                     `<li>
                        ${newArr[0]}
                      </li>`
                     } 
                </ul>`:``} 
            </div>
            <div class="product__content">
                <a href="#!" class="product__title">
                    ${value.prod_name}
                </a>
                <div class="product__price">
                    ${value.prod_oldprice == null ? '' : `<span class="price-old">${value.prod_oldprice} zł</span>`}
                        <span class="price-new">
                            ${value.prod_price} zł
                        </span>
                </div>
                <a href="#!" class="product__rating">
                    <span class="rating-block">
                        <img src="assets/img/ico-star.svg" alt="image description">
                    </span>
                    <span class="rating-block">
                        <img src="assets/img/ico-star.svg" alt="image description">
                    </span>
                    <span class="rating-block">
                        <img src="assets/img/ico-star.svg" alt="image description">
                    </span>
                    <span class="rating-block">
                        <img src="assets/img/ico-star.svg" alt="image description">
                    </span>
                    <span class="rating-block">
                        <img src="assets/img/ico-star.svg" alt="image description">
                    </span>
                </a>
                <ul class="product__actions">
                    <li>
                        <a href="#!" class="cart-list">
                            Add to cart
                        </a>
                        <a href="#!" class="tooltip cart-grid" data-tip="Add to cart">
                            <img src="assets/img/ico-cart.svg">
                        </a>
                    </li>
                    <li>
                        <a href="#!" class="tooltip" data-tip="Views: ${value.prod_views}">
                            <img src="assets/img/ico-view.svg">
                        </a>
                    </li>
                    <li>
                        <a href="#!" class="tooltip" data-tip="Add to wishlist">
                            <img src="assets/img/ico-wishlist.svg">
                        </a>
                    </li>
                    <li>
                        <a href="#!" class="tooltip" data-tip="Available: ${value.prod_availability_status_id} ${value.prod_unit}">
                            <img src="assets/img/ico-tick.svg">
                        </a>
                    </li>
                </ul>
            </div>
        </div>`

    let showProducts =
        `${!(newArr[0] == '') ? 
        `${(newArr.length == 2) ? 
            `<div class="products__item ${newArr[0]} ${newArr[1]}">
                ${product}
             </div>`
             : 
             `<div class="products__item ${newArr[0]}">
                ${product}
             </div>`
        }`:`<div class="products__item">
                ${product}
            </div>`}`

    products.innerHTML += showProducts;
}


let filteredArray = uniqValue(arr, JSON.stringify);
filteredArray.unshift("show all");
filteredArray.unshift("Filter by");

let option = ``;

const filter = document.getElementById("filter");
const productItems = document.querySelectorAll(".products__item");

function initShowFilteredSelect() {
    for (let i = 0; i < filteredArray.length; i++) {
        if (filteredArray[i] == 'Filter by') {
            option += `<option selected="true" disabled="disabled">${filteredArray[i]}</option>`
        } else if (filteredArray[i] == 'show all') {
            option += `<option value="""">${filteredArray[i]}</option>`
        } else {
            option += `<option value="${filteredArray[i]}">${filteredArray[i]}</option>`
        }
    }

    filter.innerHTML = option;
}

function uniqValue(a, key) {
    let seen = {};
    return a.filter(function (item) {
        let k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

filter.addEventListener("change", function () {
    let value = filter.value;

    [...productItems].forEach((item) => {
        if (value === "") {
            item.classList.remove("hidden");
        } else {
            if (!(item.classList.contains(value))) {
                item.classList.add("hidden");
            } else {
                item.classList.remove("hidden");
            }
        }
    });
});


initShowFilteredSelect();


//= vendors/debounce.js