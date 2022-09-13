import {Paging} from './paging';
import {Category} from './category';

export interface Categories {
    categories: Paging<Category>;
}
