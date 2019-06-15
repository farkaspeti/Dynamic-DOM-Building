const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let commentsDivEl;
let loadButtonEl;
let albumsDivEl;

function onLoadAlbums() {
    const el = this;
    const userId = el.getAttribute('data-user-id2');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
    xhr.send();
}

function onAlbumsReceived() {
    albumsDivEl.style.display = 'block';

    const text = this.responseText;
    const albums = JSON.parse(text);

    const divEl = document.getElementById('albums-content');
    while(divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createAlbumsList(albums));
}

function createAlbumsList(albums) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];

        const strongEl = document.createElement('strong');
        strongEl.textContent = album.title;

        const dataAlbumIdAttr = document.createAttribute('data-album-id');
        dataAlbumIdAttr.value = album.id;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);

        const liEl = document.createElement('li');
        
        const buttonEl = document.createElement('button');
        buttonEl.textContent = "View photos";
        buttonEl.setAttributeNode(dataAlbumIdAttr);
        buttonEl.addEventListener('click', onLoadPhotos);
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
        ulEl.appendChild(buttonEl);
    }
    return ulEl;
}

function onLoadComments(){
    const el = this;
    const postId = el.getAttribute('data-post-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load',onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();

}

function onCommentsReceived() {
    commentsDivEl.style.display = 'block';

    const text = this.responseText;
    const comments = JSON.parse(text);

    const divEl = document.getElementById('comments-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createCommentsList(comments));
}

function createCommentsList(comments) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        const strongEl = document.createElement('strong');
        strongEl.textContent = comment.name;

        const pEmailEl = document.createElement('p');
        pEmailEl.textContent = comment.email;

        // creating paragraph
        const dataCommentIdAttr = document.createAttribute('data-comment-id');
        dataCommentIdAttr.value = comment.id;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${comment.body}`));
        pEl.appendChild(pEmailEl)
        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);
    }
    return ulEl;
}

function createPostsList(posts) {
    const ulEl = document.createElement('ul');

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // creating paragraph
        const strongEl = document.createElement('strong');
        strongEl.textContent = post.title;

        const dataPostIdAttr = document.createAttribute('data-post-id');
        dataPostIdAttr.value = post.id;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`:${post.body}`));

        // creating list item
        const liEl = document.createElement('li');
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);

        const buttonEl = document.createElement('button');
        buttonEl.textContent ="Wiew Comments";
        buttonEl.setAttributeNode(dataPostIdAttr);
        buttonEl.addEventListener('click', onLoadComments);
        ulEl.appendChild(buttonEl);

    }

    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';

    const text = this.responseText;
    const posts = JSON.parse(text);

    const divEl = document.getElementById('posts-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createPostsList(posts));
}

function onLoadPosts() {
    const el = this;
    const userId = el.getAttribute('data-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onPostsReceived);
    xhr.open('GET', BASE_URL + '/posts?userId=' + userId);
    xhr.send();
}

function createUsersTableHeader() {
    const idTdEl = document.createElement('td');
    idTdEl.textContent = 'Id';

    const nameTdEl = document.createElement('td');
    nameTdEl.textContent = 'Name';

    const trEl = document.createElement('tr');
    trEl.appendChild(idTdEl);
    trEl.appendChild(nameTdEl);

    const theadEl = document.createElement('thead');
    theadEl.appendChild(trEl);
    return theadEl;
}

function createUsersTableBody(users) {
    const tbodyEl = document.createElement('tbody');

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        // creating id cell
        const idTdEl = document.createElement('td');
        idTdEl.textContent = user.id;

        // creating name cell
        const dataUserIdAttr = document.createAttribute('data-user-id');
        dataUserIdAttr.value = user.id;

        const dataUserId2Attr = document.createAttribute('data-user-id2');
        dataUserId2Attr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const buttonAlbumEl = document.createElement('button');
        buttonAlbumEl.textContent = "View albums";
        buttonAlbumEl.setAttributeNode(dataUserId2Attr);
        buttonAlbumEl.addEventListener('click', onLoadAlbums);

        const nameTdEl = document.createElement('td');
        nameTdEl.appendChild(buttonEl);

        // creating row
        const trEl = document.createElement('tr');
        trEl.appendChild(idTdEl);
        trEl.appendChild(nameTdEl);
        trEl.appendChild(buttonAlbumEl);

        tbodyEl.appendChild(trEl);
    }
    return tbodyEl;
}

function createUsersTable(users) {
    const tableEl = document.createElement('table');
    tableEl.appendChild(createUsersTableHeader());
    tableEl.appendChild(createUsersTableBody(users));
    return tableEl;
}

function onUsersReceived() {
    loadButtonEl.remove();

    const text = this.responseText;
    const users = JSON.parse(text);

    const divEl = document.getElementById('users-content');
    divEl.appendChild(createUsersTable(users));
}

function onLoadUsers() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUsersReceived);
    xhr.open('GET', BASE_URL + '/users');
    xhr.send();
}

document.addEventListener('DOMContentLoaded', (event) => {
    usersDivEl = document.getElementById('users');
    postsDivEl = document.getElementById('posts');
    albumsDivEl = document.getElementById('albums');
    commentsDivEl = document.getElementById('comments');
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
});