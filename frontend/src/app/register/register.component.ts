/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

import { SecurityAnswerService } from '../Services/security-answer.service'
import { UserService } from '../Services/user.service'
import { AbstractControl, FormControl, Validators } from '@angular/forms'
import { Component, NgZone, OnInit } from '@angular/core'
import { SecurityQuestionService } from '../Services/security-question.service'
import { Router } from '@angular/router'
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { MatSnackBar } from '@angular/material/snack-bar'

import { faExclamationCircle, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { FormSubmitService } from '../Services/form-submit.service'
import { SnackBarHelperService } from '../Services/snack-bar-helper.service'
import { TranslateService } from '@ngx-translate/core'
import { SecurityQuestion } from '../Models/securityQuestion.model'

library.add(faUserPlus, faExclamationCircle)
dom.watch()

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public emailControl: FormControl = new FormControl('', [Validators.required, Validators.email])
  public passwordControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(20)])
  public repeatPasswordControl: FormControl = new FormControl('', [Validators.required, matchValidator(this.passwordControl)])
  public securityQuestionControl: FormControl = new FormControl('', [Validators.required])
  public securityAnswerControl: FormControl = new FormControl('', [Validators.required])
  public securityQuestions!: SecurityQuestion[]
  public selected?: number
  public error: string | null = null

  constructor (private securityQuestionService: SecurityQuestionService,
    private userService: UserService,
    private securityAnswerService: SecurityAnswerService,
    private router: Router,
    private formSubmitService: FormSubmitService,
    private translateService: TranslateService,
    private snackBar: MatSnackBar,
    private snackBarHelperService: SnackBarHelperService,
    private ngZone: NgZone) { }

  ngOnInit () {
    this.securityQuestionService.find(null).subscribe((securityQuestions: any) => {
      this.securityQuestions = securityQuestions
    }, (err) => console.log(err))

    this.formSubmitService.attachEnterKeyHandler('registration-form', 'registerButton', () => this.save())
  }

  save () {
    const user = {
      email: this.emailControl.value,
      password: this.passwordControl.value,
      passwordRepeat: this.repeatPasswordControl.value,
      securityQuestion: this.securityQuestions.find((question) => question.id === this.securityQuestionControl.value),
      securityAnswer: this.securityAnswerControl.value
    }

    this.userService.save(user).subscribe((response: any) => {
      this.securityAnswerService.save({UserId: response.id, answer: this.securityAnswerControl.value,
        SecurityQuestionId: this.securityQuestionControl.value}).subscribe(() => {
          this.ngZone.run(() => this.router.navigate(['/login']))
          this.snackBarHelperService.open('CONFIRM_REGISTER')
        })
    }, (err) => {
      console.log(err)
      if (err.error && err.error.errors) {
        const error = err.error.errors[0]
        if (error.message) {
          this.error = error.message[0].toUpperCase() + error.message.slice(1)
        } else {
          this.error = error
        }
      }
    })
  }
}

function matchValidator (passwordControl: AbstractControl) {
  return function matchOtherValidate (repeatPasswordControl: FormControl) {
    let password = passwordControl.value
    let passwordRepeat = repeatPasswordControl.value
    if (password !== passwordRepeat) {
      return { notSame: true }
    }
    return null
  }
}
