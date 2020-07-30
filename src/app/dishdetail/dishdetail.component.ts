import { Component, OnInit, Input,Inject } from '@angular/core';
import {Dish} from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormGroup, FormControl } from '@angular/forms';
import { FormBuilder,Validators } from '@angular/forms';
import { visibility, flyInOut,expand } from '../animations/app.animation';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
  ,host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
  animations: [
   visibility(),
   flyInOut(),
   expand()
  ]
  
})
export class DishdetailComponent implements OnInit {
  dishForm: FormGroup;
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  dishcopy: Dish;
  visibility = 'shown';
  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,private fb: FormBuilder,@Inject('BaseURL') private BaseURL) { 
      this.createForm();
    }
    

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    

    this.dishservice.getDish(id).subscribe(dishes => this.dish = dishes,errmess => this.errMess = <any>errmess);
    

    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];


  }

  goBack(): void {
    this.location.back();
  }


  createForm() { 
    this.dishForm = this.fb.group({
    author: ['',[Validators.required, Validators.minLength(2)]],
    comment: ['',Validators.required],
    rating:['5'],
    date:['']
  });this.dishForm.valueChanges
  .subscribe(data => this.onValueChanged(data));

this.onValueChanged(); // (re)set validation messages now
}
onValueChanged(data?: any) {
if (!this.dishForm) { return; }
const form = this.dishForm;
for (const field in this.formErrors) {
  if (this.formErrors.hasOwnProperty(field)) {
    // clear previous error message (if any)
    this.formErrors[field] = '';
    const control = form.get(field);
    if (control && control.dirty && !control.valid) {
      const messages = this.validationMessages[field];
      for (const key in control.errors) {
        if (control.errors.hasOwnProperty(key)) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }
}
}

formErrors = {
'author': '',
'comment': '',

};

validationMessages = {
'author': {
  'required':      'Author Name is required.',
  'minlength':     'Author Name must be at least 2 characters long.',
},
'comment': {
  'required':      'Comment is required.',  
}
};
  

  
  

  onSubmit() {
    var d = new Date();
    this.dishForm.value.date = d.toISOString();
    this.dishcopy.comments.push(this.dishForm.value);
   
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
      
    

    this.dishForm.reset({
      author: '',
      comment: '',
      rating:5,
      date:''
      
      
    });
    
    
    

  }
}
