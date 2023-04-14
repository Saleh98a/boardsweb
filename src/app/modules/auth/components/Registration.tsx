/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import clsx from 'clsx'
import * as auth from '../redux/AuthRedux'
import { register } from '../redux/AuthCRUD'
import { Link } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'

const initialValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  changepassword: '',
  acceptTerms: false,
  accountType: 'Employee',
  days: [1, 2, 3, 4, 5]
}

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('First name is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  lastname: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Last name is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .required('Password confirmation is required')
    .when('password', {
      is: (val: string) => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
    }),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setTimeout(() => {
        register(values.email, values.firstname, values.lastname, values.password, values.accountType, values.days)
          .then(() => {
            setLoading(false)
            dispatch(auth.actions.login('', values.email, values.password))
          })
          .catch(() => {
            setLoading(false)
            setSubmitting(false)
            setStatus('Registration process has broken')
          })
      }, 1000)
    },
  })

  function onAccountTypeChange(event: any): void {
    formik.values.accountType = event.target.value;
  }

  function onWorkingDaysChange(event: FormEvent<HTMLInputElement>): void {
    const day = Number.parseInt(event.currentTarget.value);
    const days = formik.values.days;
    if (days.includes(day) && !event.currentTarget.checked) {
      const index = days.indexOf(day, 0);
      if (index > -1) {
        days.splice(index, 1);
      }
    } else if (!days.includes(day) && event.currentTarget.checked && !days.includes(day)) {
      days.push(day);
    }
    console.log("working days", days);
  }

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className='mb-10 text-center'>
        {/* begin::Title */}
        <h1 className='text-dark mb-3'>Create an Account</h1>
        {/* end::Title */}
      </div>
      {/* end::Heading */}

      {formik.status && (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      )}

      {/* begin::Form group Firstname */}
      <div className='row fv-row mb-7'>
        <div className='col-xl-6'>
          <label className='class="form-label fw-bolder text-dark fs-6'>First name</label>
          <input
            placeholder='First name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('firstname')}
            className={clsx(
              'form-control form-control-lg form-control-solid',
              {
                'is-invalid': formik.touched.firstname && formik.errors.firstname,
              },
              {
                'is-valid': formik.touched.firstname && !formik.errors.firstname,
              }
            )}
          />
          {formik.touched.firstname && formik.errors.firstname && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.firstname}</span>
              </div>
            </div>
          )}
        </div>
        <div className='col-xl-6'>
          {/* begin::Form group Lastname */}
          <div className='fv-row mb-5'>
            <label className='form-label fw-bolder text-dark fs-6'>Last name</label>
            <input
              placeholder='Last name'
              type='text'
              autoComplete='off'
              {...formik.getFieldProps('lastname')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.lastname && formik.errors.lastname,
                },
                {
                  'is-valid': formik.touched.lastname && !formik.errors.lastname,
                }
              )}
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.lastname}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Form group */}
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Email */}
      <div className='fv-row mb-7'>
        <label className='form-label fw-bolder text-dark fs-6'>Email</label>
        <input
          placeholder='Email'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            {
              'is-valid': formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className='mb-10 fv-row' data-kt-password-meter='true'>
        <div className='mb-1'>
          <label className='form-label fw-bolder text-dark fs-6'>Password</label>
          <div className='position-relative mb-3'>
            <input
              type='password'
              placeholder='Password'
              autoComplete='off'
              {...formik.getFieldProps('password')}
              className={clsx(
                'form-control form-control-lg form-control-solid',
                {
                  'is-invalid': formik.touched.password && formik.errors.password,
                },
                {
                  'is-valid': formik.touched.password && !formik.errors.password,
                }
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.password}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-dark fs-6'>Confirm Password</label>
        <input
          type='password'
          placeholder='Password confirmation'
          autoComplete='off'
          {...formik.getFieldProps('changepassword')}
          className={clsx(
            'form-control form-control-lg form-control-solid',
            {
              'is-invalid': formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              'is-valid': formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10 mt-10'>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input" type="radio" name="accountType" id="flexRadioDefault1" value="Employee"
            onClick={onAccountTypeChange}
            defaultChecked />
          <label className="form-check-label" htmlFor="flexRadioDefault1">
            Employee
          </label>
        </div>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input" type="radio" name="accountType" id="flexRadioDefault2" value="Manager"
            onClick={onAccountTypeChange}
          />
          <label className="form-check-label" htmlFor="flexRadioDefault2">
            Manager
          </label>
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <label className='form-label fw-bolder text-dark fs-6  mb-4'>Working Days</label>
      <div className='fv-row mb-10'>
        <div className="form-check form-check-inline mb-4">
          <input
            className="form-check-input" type="checkbox" name="accountType" id="flexCheckboxDefault1" value="1"
            onClick={onWorkingDaysChange}
            defaultChecked />
          <label className="form-check-label" htmlFor="flexCheckboxDefault1">
            Sunday
          </label>
        </div>
        <div className="form-check form-check-inline mb-4">
          <input
            className="form-check-input" type="checkbox" name="accountType" id="flexCheckboxDefault2" value="2"
            onClick={onWorkingDaysChange}
            defaultChecked
          />
          <label className="form-check-label" htmlFor="flexCheckboxDefault2">
            Monday
          </label>
        </div>
        <div className="form-check form-check-inline mb-4">
          <input
            className="form-check-input" type="checkbox" name="accountType" id="flexCheckboxDefault3" value="3"
            onClick={onWorkingDaysChange}
            defaultChecked
          />
          <label className="form-check-label" htmlFor="flexCheckboxDefault3">
            Tuesday
          </label>
        </div>
        <div className="form-check form-check-inline mb-4">
          <input
            className="form-check-input" type="checkbox" name="accountType" id="flexCheckboxDefault4" value="4"
            onClick={onWorkingDaysChange}
            defaultChecked
          />
          <label className="form-check-label" htmlFor="flexCheckboxDefault4">
            Wednesday
          </label>
        </div>
        <div className="form-check form-check-inline mb-4">
          <input
            className="form-check-input" type="checkbox" name="accountType" id="flexCheckboxDefault5" value="5"
            onClick={onWorkingDaysChange}
            defaultChecked
          />
          <label className="form-check-label" htmlFor="flexCheckboxDefault5">
            Thursday
          </label>
        </div>
        <div className="form-check form-check-inline mb-4">
          <input
            className="form-check-input" type="checkbox" name="accountType" id="flexCheckboxDefault6" value="6"
            onClick={onWorkingDaysChange}
          />
          <label className="form-check-label" htmlFor="flexCheckboxDefault6">
            Friday
          </label>
        </div>
        <div className="form-check form-check-inline mb-4">
          <input
            className="form-check-input" type="checkbox" name="accountType" id="flexCheckboxDefault7" value="7"
            onClick={onWorkingDaysChange}
          />
          <label className="form-check-label" htmlFor="flexCheckboxDefault7">
            Saturday
          </label>
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='fv-row mb-10'>
        <div className='form-check form-check-custom form-check-solid'>
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
          <label
            className='form-check-label fw-bold text-gray-700 fs-6'
            htmlFor='kt_login_toc_agree'
          >
            I Agree to the
            <Link to='/auth/terms' className='ms-1 link-primary'  >
              terms and conditions
            </Link>
            .
          </label>
          {formik.touched.acceptTerms && formik.errors.acceptTerms && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.acceptTerms}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Submit</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...{' '}
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button
            type='button'
            id='kt_login_signup_form_cancel_button'
            className='btn btn-lg btn-light-primary w-100 mb-5'
          >
            Cancel
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  )
}
