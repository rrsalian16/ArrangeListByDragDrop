const dragableList = document.getElementById('dragable-list');
const check = document.getElementById('btn');

let arr;
const listItems = [];

async function richPersionList() {
    arr = await getRichPersons();
    console.log(arr);
    intialize();
}
richPersionList();

const IMAGE_PLACEHOLDER = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Ftoppng.com%2Fdonna-picarro-dummy-avatar-PNG-free-PNG-Images_239768&psig=AOvVaw3qQflaG13YfYkorcSVK82R&ust=1631523589493000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJj49pWJ-fICFQAAAAAdAAAAABAD';

function intialize() {

    [...arr].sort((a, b) => a.sort - b.sort).forEach((person, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-index', index);

        listItem.innerHTML = `
            <span class="number">${index + 1}</span>
            <div class="dragable" draggable="true">
                <img src='${person.squareImage || IMAGE_PLACEHOLDER} ' width='60px' height='60px' alt='${person.uri}' />
                <p class="person-name">${person.name}</p>
                <i class="fas fa-grip-horizontal    "></i>
            </div>
            `;

        listItems.push(listItem);
        dragableList.appendChild(listItem);
    });
    addEventListener();
}


let dragStartIndex;


function dragStart() {
    // console.log("EVENT: dragStart");
    dragStartIndex = +this.closest('li').getAttribute('data-index');
    console.log(dragStartIndex);
}
function dragOver(e) {
    // console.log("EVENT: dragOver");
    e.preventDefault();
}
function dragEnter() {
    // console.log("EVENT: dragEnter");
    this.classList.add('over');
}
function dragLeave() {
    // console.log("EVENT: dragLeave");
    this.classList.remove('over');
}
function dragDrop() {
    // console.log("EVENT: dragDrop");
    const dragStopIndex = +this.getAttribute('data-index');
    swapIndex(dragStartIndex, dragStopIndex);
    this.classList.remove('over');
}

/**
 * swap list items by drag and drop  
 * @param {number} fromIndex index where drag start
 * @param {number} toIndex index where drag stop
 */
function swapIndex(fromIndex, toIndex) {
    const itemOne = listItems[fromIndex].querySelector('.dragable');
    const itemTwo = listItems[toIndex].querySelector('.dragable');

    listItems[fromIndex].appendChild(itemTwo);
    listItems[toIndex].appendChild(itemOne);
}

/**
 * add draggable event listener
 */
function addEventListener() {
    const draggables = document.querySelectorAll('.dragable');
    const dragableItems = document.querySelectorAll('.dragable-list li');

    draggables.forEach(dragable => {
        dragable.addEventListener('dragstart', dragStart);
    });

    dragableItems.forEach(item => {
        item.addEventListener('dragover', dragOver);
        item.addEventListener('dragenter', dragEnter);
        item.addEventListener('dragleave', dragLeave);
        item.addEventListener('drop', dragDrop);
    });
}

/**
 * check the order of the list items with the correct one.
 */
function checkOrder() {
    listItems.forEach((item, index) => {
        const personName = item.querySelector('.dragable').innerText.trim();

        if (personName !== arr[index].name) item.classList.add('wrong');
        else { item.classList.remove('wrong'); item.classList.add('right'); }
    });
}

check.addEventListener('click', checkOrder);

async function getRichPersons() {
    const response = await fetch('https://forbes400.herokuapp.com/api/forbes400?limit=10');
    const list = await response.json();
    return list.map(({ person }) => ({ ...person, sort: Math.random() }));
}