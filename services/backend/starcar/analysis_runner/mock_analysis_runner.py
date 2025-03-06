from .analysis_runner import AnalysisRunner


class MockAnalysisRunner(AnalysisRunner):

    def run_analysis(self, mission_id: int):
        print("Mock analysis ... skipping analysis")
