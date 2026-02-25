import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check for chunk loading error
    const isChunkError =
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Loading CSS chunk') ||
      error.name === 'ChunkLoadError';

    if (isChunkError) {
      // Check if we already reloaded to avoid infinite loops
      const hasReloaded = sessionStorage.getItem('chunk_reload_attempt');
      if (!hasReloaded) {
        sessionStorage.setItem('chunk_reload_attempt', 'true');
        window.location.reload();
        return { hasError: false }; // Don't show error UI, just reload
      }
    }

    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Clear the reload flag on successful subsequent loads (though hard to do here without useEffect)
    // Actually, we can clear it if we reach here but decide NOT to reload?
    // Or clear it on successful mount of App. For now, simple session flag is okay,
    // it will clear on tab close or we can clear it after a timeout.
  }

  componentDidMount() {
    // If the app mounts successfully without error, clear the flag
    // But this component wraps the app, so it mounts first.
    // We should clear the flag after a short delay to indicate successful load.
    if (sessionStorage.getItem('chunk_reload_attempt')) {
        setTimeout(() => {
            sessionStorage.removeItem('chunk_reload_attempt');
        }, 5000);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 text-center font-display">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full card border border-red-100 dark:border-red-900/30">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 dark:text-red-400">
                <span className="material-icons-round text-3xl">error_outline</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Terjadi Kesalahan</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Maaf, aplikasi mengalami masalah saat memuat data. Silakan coba muat ulang halaman.
            </p>
            <button
              onClick={() => {
                sessionStorage.removeItem('chunk_reload_attempt');
                window.location.reload();
              }}
              className="w-full py-3 bg-primary text-white rounded-xl hover:bg-primary-700 transition-colors font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
            >
              <span className="material-icons-round">refresh</span>
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
