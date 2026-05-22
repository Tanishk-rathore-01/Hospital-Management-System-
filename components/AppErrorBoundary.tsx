import { Component, ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="m-4 rounded-lg border border-rose-400/30 bg-rose-500/10 p-6 text-slate-100 sm:m-6">
          <p className="text-lg font-bold text-rose-100">This page could not load.</p>
          <p className="mt-2 text-sm text-rose-100/80">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-4 rounded-lg bg-rose-400 px-4 py-2 text-sm font-semibold text-[#071214] hover:bg-rose-300"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
