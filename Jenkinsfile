pipeline {
	agent any

	environment {
			APP_NAME = 'jenkins-day4-app'
			DEFAULT_ENV = 'dev'
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
		stage('Deploy') {
				when {
					expression {
						params.ENVIRONMENT == 'production'
					}
				}
				steps {
					echo '==========================='
					echo 'Production Deploy Stage'
					echo '==========================='	
					
					echo "Deploying ${env.APP_NAME} to ${params.ENVIRONMENT}"
	
					echo 'Production deployment simulation successful!'				
				}
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
