import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import pagination from './views/paginationView.js';
import { async } from 'regenerator-runtime';
import addRecipeView from './views/addRecipeView.js';
import MODAL_CLOSE_SEC from './config.js';

//polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationView from './views/paginationView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //Id get
    const id = window.location.hash.slice(1); //get entire url and slice(1) to remove #
    //console.log(id);
    if (!id) return;

    //0>Result view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    //1> Updating bookmarks view
    //debugging;
    bookmarksView.update(model.state.bookmarks);

    //2> Loading recipe
    recipeView.renderSpinner();
    await model.loadRecipe(id); //load recipe is async fun, so we need await it when call promise
    //const { recipe } = model.state;

    //3> Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};
//controlRecipes();

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //(1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    //(2) Load Search results
    await model.loadSearchResults(query);

    //(3) render results
    //console.log(resultsView);
    //console.log(model.state.search.results);
    //resultsView.render(model.state.search.results); //get all results
    resultsView.render(model.getSearchResultsPage());

    //(4) render initial pagination buttons
    pagination.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};
//controlSearchResults();

const controlPagination = function (goToPage) {
  //1 render NEW results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2 render NEW initial pagination buttons
  pagination.render(model.state.search);
};

const controlServings = function (newServings) {
  //update the recipe servings (in state)
  model.updateServings(newServings);

  //Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //1) Add/remove bookmark
  //console.log(model.state.recipe.bookmarked);
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  //2) Update recipe view
  //console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  //3) Rendering Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();

    //Upload the new recipe data
    //console.log(newRecipe);
    await model.uploadRecipe(newRecipe);

    //recipe data we upload when add to state
    console.log(model.state.recipe);

    //render upload recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    ///

    //Render bookmark views
    bookmarksView.render(model.state.bookmarks);

    //Change id in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form windows
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('ERROR!@', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('WELCOME APP!!!');
};
init();
