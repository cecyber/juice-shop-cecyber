/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

import { Component, NgZone } from '@angular/core'
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { faCartArrowDown } from '@fortawesome/free-solid-svg-icons'
import { Router } from '@angular/router'

library.add(faCartArrowDown)
dom.watch()

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent {

  public productCount: number = 0
  public bonus: number = 0

  constructor (private router: Router, private ngZone: NgZone) {}

  checkout () {
    this.ngZone.run(() => this.router.navigate(['/address/select']))
  }

  getProductCount (total) {
    this.productCount = total
  }

  getBonusPoints (total) {
    sessionStorage.setItem('itemTotal', total[0])
    this.bonus = total[1]
  }
}
