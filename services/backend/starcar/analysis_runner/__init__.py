from .analysis_runner import AnalysisRunner

try:
    from .kube_analysis_runner import KubeAnalysisRunner as Runner
except ImportError:
    from .mock_analysis_runner import (  # type: ignore
        MockAnalysisRunner as Runner  
    )
    
analysis_runner: AnalysisRunner = Runner()
