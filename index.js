let input = document.querySelector('.form-control');
let dropdownMenu = document.querySelector('.dropdown-menu');
let movieInfo = document.querySelector('.movie-information');

async function fetchData(movie, parameter) {
    let apikey = 'd9835cc5';

    try {
        let response = await fetch(`http://www.omdbapi.com/?apikey=${apikey}&${parameter}=${movie}`);
        let data = await response.json();

        if (!data.Response) {
            return [];
        }
   
        return data;
    } catch (error) {
        console.log(error);
    }
}

function autocomplete(data) {
    let items = data.Search;

    if (items) {
        dropdownMenu.classList.remove('d-none');
        dropdownMenu.classList.add('d-block');
    
        items.forEach(function(item) {
            let title = item.Title;
            let year = item.Year;
            let imdbID = item.imdbID;
            let img = item.Poster === 'N/A' ? '' : item.Poster;
            
            let html = `
                <a class="dropdown-item" href="#${imdbID}" data-imdbID=${imdbID}>
                    <img src="${img}"> ${title} (${year})
                </a>
            `;
            dropdownMenu.insertAdjacentHTML('beforeend', html);
        });  
  
        getMovie(document.querySelectorAll('.dropdown-item')); 
    } else {
        dropdownMenu.classList.remove('d-block');
        dropdownMenu.classList.add('d-none');
    }
}

function getMovie(dropdownItem) {
    dropdownItem.forEach(function(items) {
        items.addEventListener('click', function(e) {
            fetchMovie(e.target.dataset.imdbid);
            dropdownMenu.classList.remove('d-block');
            input.value = e.target.text.trim();
        });
    });
}

function fetchMovie(id) {
    fetchData(id, 'i')
        .then(movieInformation)
        .catch(error => console.log(error));
}

function movieInformation(data) {
    let img = data.Poster;
    let elements = {
        year: data.Year,
        title: data.Title,
        released: data.Released,
        runtime: data.Runtime,
        genre: data.Genre,
        director: data.Director,
        writer: data.Writer,
        actors: data.Actors,
        plot: data.Plot,
        awards: data.Awards,
        rating: data.imdbRating,
        boxOffice: data.BoxOffice,
        production: data.Production
    };
    
    movieInfo.innerHTML = '';

    let image = `<img src="${img}" class="rounded mx-auto d-block mt-4" alt="">`;
        movieInfo.innerHTML = image;

    for (let key in elements) {
        if (elements[key] && elements[key].replace('N/A', '')) {
            let html = `
            <div class="d-block p-2 bg-primary text-white mt-4 text-center">
                <h4>${key}</h4>
                <span>${elements[key]}</span>
            </div>
        `;

        movieInfo.insertAdjacentHTML('beforeend', html);   
        }
    }
}

input.addEventListener('input', function(e) {
    let inputValue = e.target.value;

    dropdownMenu.innerHTML = '';
    if (e.target.value) {
        fetchData(inputValue, 's')
            .then(autocomplete)
            .catch(error => console.log(error));
    }
});

input.addEventListener('focus', function() {
    this.value = '';
    dropdownMenu.classList.add('d-none');
});

document.addEventListener('click', function(e) {
    if (!dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('d-block');
        dropdownMenu.classList.add('d-none');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    let loc = location.hash.replace('#', '');
    fetchMovie(loc);    
});

        

