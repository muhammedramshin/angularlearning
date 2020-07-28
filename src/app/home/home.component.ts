import { Component, OnInit,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import {Leader} from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { flyInOut } from '../animations/app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut()
    ]
})
export class HomeComponent implements OnInit {
  dishErrMess : string;
  dish: Dish;
  leaderErrMess:string;
  promotion: Promotion;
  promoErrMess:string;
leader:Leader;

  constructor(private dishservice: DishService,
    private promotionservice: PromotionService, private leaderservice: LeaderService,@Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    
    this.dishservice.getFeaturedDish().subscribe(dishes => this.dish = dishes,errmess => this.dishErrMess= <any>errmess);

    
     this.promotionservice.getFeaturedPromotion().subscribe(promotion =>this.promotion = promotion,errmess =>this.promoErrMess = <any>errmess);
   

    this.leaderservice.getFeaturedLeader().subscribe(leader => this.leader = leader,errmess =>this.leaderErrMess=<any>errmess);
  }

}