const BASE_URL = 'https://jsonplaceholder.typicode.com';

let usersDivEl;
let postsDivEl;
let albumsDivEl;
let loadButtonEl;

function onLoadAlbums() {
    const el = this;
    const userId = el.getAttribute('album-user-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onAlbumsReceived);
    xhr.open('GET', BASE_URL + '/albums?userId=' + userId);
    xhr.send();
}

function onAlbumsReceived() {
    postsDivEl.style.display = 'none';
    albumsDivEl.style.display = 'block';

    const text = this.responseText;
    const albums = JSON.parse(text);

    const divEl = document.getElementById('albums-content');
    while (divEl.firstChild) {
        divEl.removeChild(divEl.firstChild);
    }
    divEl.appendChild(createAlbumsList(albums));
}

function createAlbumsList(albums) {
    const ulEl = document.createElement('ul');

    const h3El = document.createElement('h3');
    h3El.textContent = 'Albums: ';
    ulEl.appendChild(h3El);


    for (let i = 0; i < albums.length; i++) {
        const album = albums[i];

        const strongEl = document.createElement('strong');
        strongEl.textContent = album.title;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);

        const albumIdAttr = album.id;

        // creating list item
        const liEl = document.createElement('li');
        liEl.setAttribute('id', albumIdAttr)
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);

        const buttonEl = document.createElement('button');
        buttonEl.textContent ="View Photos";
        buttonEl.setAttribute('album-user-id', albumIdAttr);
        buttonEl.addEventListener('click', onLoadPhotos);
        ulEl.appendChild(buttonEl);
    }
    return ulEl;
}

function onLoadComments() {
    const el = this;
    const postId = el.getAttribute('post-id');

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onCommentsReceived);
    xhr.open('GET', BASE_URL + '/comments?postId=' + postId);
    xhr.send();
}

function onCommentsReceived() {
    const text = this.responseText;
    const comments = JSON.parse(text);

    const postId = comments[0].postId;
    const commentIds = document.getElementsByClassName('comments');

    for (let i = 0; i < commentIds.length; i++) {
        const comment = commentIds[i];
        if (comment.getAttribute('id') !== postId) {
            comment.remove();
        }
    }

    const divPostC = document.getElementById(postId);
    if (divPostC.childNodes.length <= 1) {
        divPostC.appendChild(createCommentsList(comments));
    }
}

function createCommentsList(comments) {
    const ulEl = document.createElement('ul');
    ulEl.classList.add('comments');

    const h4El = document.createElement('h4');
    h4El.textContent = 'Comments: ';
    ulEl.appendChild(h4El);

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        ulEl.setAttribute('id', comment.postId);

        const strongEl = document.createElement('strong');
        strongEl.textContent = comment.name;

        const h5El = document.createElement('h5');
        h5El.textContent = comment.email;

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`: ${comment.body}`));
        pEl.appendChild(h5El);

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

        const pEl = document.createElement('p');
        pEl.appendChild(strongEl);
        pEl.appendChild(document.createTextNode(`:${post.body}`));

        const postIdAttr = post.id;

        // creating list item
        const liEl = document.createElement('li');
        liEl.setAttribute('id', postIdAttr)
        liEl.appendChild(pEl);

        ulEl.appendChild(liEl);

        const buttonEl = document.createElement('button');
        buttonEl.textContent ="View Comments";
        buttonEl.setAttribute('post-id', postIdAttr);
        buttonEl.addEventListener('click', onLoadComments);
        ulEl.appendChild(buttonEl);
    }
    return ulEl;
}

function onPostsReceived() {
    postsDivEl.style.display = 'block';
    albumsDivEl.style.display = 'none';

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

        // creating name cell
        const albumUserIdAttr = document.createAttribute('album-user-id');
        albumUserIdAttr.value = user.id;

        const buttonEl = document.createElement('button');
        buttonEl.textContent = user.name;
        buttonEl.setAttributeNode(dataUserIdAttr);
        buttonEl.addEventListener('click', onLoadPosts);

        const buttonAlbumEl = document.createElement('button');
        buttonAlbumEl.textContent = "View albums";
        buttonAlbumEl.setAttributeNode(albumUserIdAttr);
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
    loadButtonEl = document.getElementById('load-users');
    loadButtonEl.addEventListener('click', onLoadUsers);
});