import {Component, OnInit} from '@angular/core';
import {NavigationItem} from '../../models/navigation-item';
import {faHome, faSearch, faStream} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';

@Component({
    selector: 'app-bottom-navigation',
    templateUrl: './bottom-navigation.component.html',
    styleUrls: ['./bottom-navigation.component.scss']
})
export class BottomNavigationComponent implements OnInit {

    constructor(
        private router: Router
    ) {}

    selectedItem: NavigationItem;
    items: NavigationItem[] = [
        {
            path: 'home',
            name: 'Home',
            icon: faHome
        },
        {
            path: 'browse',
            name: 'Wyszukaj',
            icon: faSearch
        },
        {
            path: 'library',
            name: 'Biblioteka',
            icon: faStream
        }
    ];

    ngOnInit(): void {
        this.selectedItem = this.items[0];
    }

    onItemClick(item: NavigationItem): void {
        this.selectedItem = item;
        this.router.navigate([item.path]);
    }

}
