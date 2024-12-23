/*
 * Copyright (c) 2014-2020 Bjoern Kimminich.
 * SPDX-License-Identifier: MIT
 */

import { UserService } from '../Services/user.service'
import { SecurityQuestionService } from '../Services/security-question.service'
import { AbstractControl, FormControl, Validators } from '@angular/forms'
import { Component } from '@angular/core'
import { dom, library } from '@fortawesome/fontawesome-svg-core'
import { faSave } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { SecurityQuestion } from '../Models/securityQuestion.model'
import { TranslateService } from '@ngx-translate/core'

library.add(faSave, faEdit)
dom.watch()

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  public emailControl: FormControl = new FormControl('', [Validators.required, Validators.email])
  public securityQuestionControl: FormControl = new FormControl({ disabled: true, value: '' }, [Validators.required])
  public passwordControl: FormControl = new FormControl({ disabled: true, value: '' }, [Validators.required, Validators.minLength(5)])
  public repeatPasswordControl: FormControl = new FormControl({ disabled: true, value: '' }, [Validators.required, matchValidator(this.passwordControl)])
  public securityQuestion?: string
  public error?: string
  public confirmation?: string

  constructor (private securityQuestionService: SecurityQuestionService, private userService: UserService, private translate: TranslateService) { }

  findSecurityQuestion () {
    this.securityQuestion = undefined
    if (this.emailControl.value) {
      this.securityQuestionService.findBy(this.emailControl.value).subscribe((securityQuestion: SecurityQuestion) => {
        if (securityQuestion) {
          this.securityQuestion = securityQuestion.question
          this.securityQuestionControl.enable()
          this.passwordControl.enable()
          this.repeatPasswordControl.enable()
        } else {
          this.securityQuestionControl.disable()
          this.passwordControl.disable()
          this.repeatPasswordControl.disable()
        }
      },
      (error) => error
      )
    } else {
      this.securityQuestionControl.disable()
      this.passwordControl.disable()
      this.repeatPasswordControl.disable()
    }
  }

  resetPassword () {
    this.userService.resetPassword({email: this.emailControl.value, answer: this.securityQuestionControl.value,
      new: this.passwordControl.value, repeat: this.repeatPasswordControl.value}).subscribe(() => {
        this.error = undefined
        this.translate.get('PASSWORD_SUCCESSFULLY_CHANGED').subscribe((passwordSuccessfullyChanged) => {
          this.confirmation = passwordSuccessfullyChanged
        }, (translationId) => {
          this.confirmation = translationId
        })
        this.resetForm()
      }, (error) => {
        this.error = error.error
        this.confirmation = undefined
        this.resetErrorForm()
      })
  }

  resetForm () {
    this.emailControl.setValue('')
    this.emailControl.markAsPristine()
    this.emailControl.markAsUntouched()
    this.securityQuestionControl.setValue('')
    this.securityQuestionControl.markAsPristine()
    this.securityQuestionControl.markAsUntouched()
    this.passwordControl.setValue('')
    this.passwordControl.markAsPristine()
    this.passwordControl.markAsUntouched()
    this.repeatPasswordControl.setValue('')
    this.repeatPasswordControl.markAsPristine()
    this.repeatPasswordControl.markAsUntouched()
  }

  resetErrorForm () {
    this.emailControl.markAsPristine()
    this.emailControl.markAsUntouched()
    this.securityQuestionControl.setValue('')
    this.securityQuestionControl.markAsPristine()
    this.securityQuestionControl.markAsUntouched()
    this.passwordControl.setValue('')
    this.passwordControl.markAsPristine()
    this.passwordControl.markAsUntouched()
    this.repeatPasswordControl.setValue('')
    this.repeatPasswordControl.markAsPristine()
    this.repeatPasswordControl.markAsUntouched()
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
