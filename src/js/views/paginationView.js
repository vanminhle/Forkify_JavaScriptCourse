import View from './View.js';
import icons from '../../img/icons.svg'; //Icon svg parcel import

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      console.log(btn);

      const goToPage = +btn.dataset.goto; //convert to num
      console.log(goToPage);

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page; //model.state.search.page (model.state.search = data)

    const numPages = Math.ceil(
      //the number of pages (10 results / 2 = 5 pages)
      this._data.results.length / this._data.resultsPerPage
    );
    //console.log(numPages);

    //page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupNext(curPage);
    }

    //Last Page
    if (curPage === numPages && numPages > 1) {
      return this._generateMarkupPrevious(curPage);
    }

    //Other Page
    if (curPage < numPages) {
      return (
        this._generateMarkupPrevious(curPage) +
        this._generateMarkupNext(curPage)
      );
    }

    //page 1, and there are NO other pages
    return 'only 1 page';
  }

  _generateMarkupNext(curPage) {
    return `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
        <span>Page ${curPage + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `;
  }

  _generateMarkupPrevious(curPage) {
    return `
      <button data-goto="${
        curPage - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>
    `;
  }
}

export default new PaginationView();
