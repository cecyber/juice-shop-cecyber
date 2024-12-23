/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

import { Component, NgZone } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { TwoFactorAuthService } from '../Services/two-factor-auth-service'
import { CookieService } from 'ngx-cookie-service'
import { UserService } from '../Services/user.service'
import { Router } from '@angular/router'
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faUnlockAlt)
dom.watch()

interface TokenEnterFormFields {
  token: string
}

@Component({
  selector: 'app-two-factor-auth-enter',
  templateUrl: './two-factor-auth-enter.component.html',
  styleUrls: ['./two-factor-auth-enter.component.scss']
})
export class TwoFactorAuthEnterComponent {
  public twoFactorForm: FormGroup = new FormGroup({
    token: new FormControl('', [Validators.minLength(6), Validators.maxLength(6), Validators.required, Validators.pattern('^[\\d]{6}$')])
  })

  public errored: Boolean = false

  constructor (
    private twoFactorAuthService: TwoFactorAuthService,
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  verify () {
    const fields: TokenEnterFormFields = this.twoFactorForm.value

    this.twoFactorAuthService.verify(fields.token).subscribe((authentication) => {
      localStorage.setItem('token', authentication.token)
      let expires = new Date()
      expires.setHours(expires.getHours() + 8)
      this.cookieService.set('token', authentication.token, expires, '/')
      sessionStorage.setItem('bid', authentication.bid.toString())
      /* Use userService to notifiy if user has logged in*/
      /* this.userService.isLoggedIn = true;*/
      this.userService.isLoggedIn.next(true)
      this.ngZone.run(() => this.router.navigate(['/search']))
    }, (error) => {
      this.errored = true
      setTimeout(() => {
        this.errored = false
      }, 5 * 1000)
      return error
    })
  }

}
