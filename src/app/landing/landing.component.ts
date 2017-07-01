import { AuthService } from './../auth.service';
import { CategoryService } from './../category.service';
import { User } from './../user/user';
import { Category } from './../category';
import { Component, OnInit, HostListener } from '@angular/core';
import { ArticleService } from "../article/article.service";
import { Article } from "../article/article";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  providers: [ArticleService]
})
export class LandingComponent implements OnInit {

  categoryList: Category[];
  user: User;
  backgroundUrl = [
    'https://i.ytimg.com/vi/GyUrxhPs7iw/maxresdefault.jpg',
    'http://orig05.deviantart.net/54fe/f/2015/065/0/6/tressor_by_jandyaditya-d8kov0q.png',
    'http://wasiladev.com/wp-content/uploads/2017/03/seo.png',
    'https://www.sketchappsources.com/resources/source-image/Xbox-One-Pad-dembsky.png',
    'https://i.ytimg.com/vi/t5CotvyUmb8/maxresdefault.jpg',
    'https://i.ytimg.com/vi/ROlYuWRGP0w/maxresdefault.jpg',
    'https://mir-s3-cdn-cf.behance.net/project_modules/fs/537d9047268173.587553663b674.png',
    'http://www.gettingsmart.com/wp-content/uploads/2015/07/theory-vector-482x335.jpg'
  ];

  config: Object = {
    pagination: '.swiper-pagination',
    paginationClickable: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    autoplay: 3000
  };

  categoryPage: any;
  comingSoonCategoryLength: any;
  comingSoonCategory: any;
  newsType: string = 'latest';
  activeTab: string = 'latest';
  inactiveTab: string = 'popular';
  totalComments: number;
  recommendedArticles: Article[];
  defaultImage = 'assets/images/loading.gif';

  constructor(private categoryService: CategoryService, private auth: AuthService, private articleServce: ArticleService) { }

  ngOnInit() {
    this.comingSoonCategoryLength = 0;
    this.comingSoonCategory = [];
    this.categoryPage = [];
    this.categoryService.getCategories().then(
      (response) => {
        this.categoryList = response;
        let j = 1;
        this.categoryPage[j - 1] = [];
        this.categoryList.forEach((category, index) => {
          if (index >= 4 * j) {
            j++;
            this.categoryPage[j - 1] = [];
          };
          this.categoryPage[j - 1].push(category);
        });
        if (this.categoryPage[j - 1].length < 4) {
          this.comingSoonCategoryLength = 4 - this.categoryPage[j - 1].length;
          this.comingSoonCategory = new Array(this.comingSoonCategoryLength);
        }
      }
    );
    if (this.auth.authenticated()) {
      this.articleServce.getRecommendedArticles(this.auth.userProfile.identities[0].user_id).then(res => {
        this.recommendedArticles = res;
        console.log(this.recommendedArticles);
      });
    };
  }

  checkProfile() {
    let profile = localStorage.getItem('profile');
    if (profile) {
      this.user = JSON.parse(profile);
      return true;
    }
    return false;
  }

  updateTab() {
    this.activeTab = this.activeTab == 'latest' ? 'popular' : 'latest';
    this.inactiveTab = this.inactiveTab == 'latest' ? 'popular' : 'latest';
  }

  getTotalComments(articleId: string) {
    this.articleServce.getComments(articleId).then(res => this.totalComments = res.length);
  }

  getCategoryName(categoryId) {
    for (let category of this.categoryList) {
      if (category._id == categoryId) {
        return category.name.toLowerCase();
      }
    }
  }
}
