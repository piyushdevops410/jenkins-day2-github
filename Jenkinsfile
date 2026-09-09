pipeline {

	agent any

	environment {
			APP_NAME = 'jenkins-day5-app'
				}
	
	stages {
		stage('Information') {
				steps {
					echo '========================'
					echo 'Jenkins Day 4 - Advance Pipeline'
					echo '========================'
					
					echo "Job Name: ${env.JOB_NAME}"
					echo "Build Number: ${env.BUILD_NUMBER}"
					echo "Workspace: ${env.WORKSPACE}"					
					echo "Application: ${env.APP_NAME}"
					echo "Default Environment: ${env.DEFAULT_ENV}"
				}
		}
		stage('Build') {
			
				steps {
					echo '========================='
					echo 'Build Stage'
					echo '========================='
					echo "Building ${env.APP_NAME}"

					sh 'ls -la'
				}
		}
			
		stage('Credentials Test') {
					steps {
						echo '============================'
						echo  'Credentials Test'
						echo '============================'			
						
						withCredentials([
							string(
								credentialsId: 'day5-test-secret',
								variable: 'MY_SECRET'
							)
						]) {
							sh '''
								echo "Credential is available to the Pipeline"
								echo "secres length:"
								echo -n "$MY_SECRET" | wc -c
								'''
							}
					}
		}

		stage('Test') {
				steps {
					echo '=========================='
					echo 'Test Stage'
					echo '=========================='

					echo 'Testing Application...'

					sh 'test -f index.html'
					echo 'index.html exists - Test Passed!'
				}
		}

	post {
		always {
			echo '============================'
			echo 'Pipeline Finished'
			echo '============================'	
		}
		success {
			echo 'SUCCESS: Pipeline completed successfully!'
			}
		failure {
			echo 'FAILURE: Pipeline failed!'
		}
	}

}
