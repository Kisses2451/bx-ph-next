'use client'

import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

/** Catches rendering errors anywhere below it and shows a "Something went wrong" message instead of a blank page. */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="simple-page shared-container simple-page--center" role="alert">
          <p className="bx-eyebrow">Error</p>
          <h1 className="simple-page__title">Something went wrong</h1>
          <p className="simple-page__text">Please refresh the page or go back to the home page.</p>
          <a className="bx-btn bx-btn--primary" href="/">Back to home</a>
        </section>
      )
    }
    return this.props.children
  }
}
