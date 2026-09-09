pipeline {
	agent any
	
	stages {
		stage('Build') {
			
				steps{
					echo '========================='
					echo 'Build Stage'
					echo '========================='
					echo 'Building Application...'
					sh 'ls -la'
				}
		}

		stage('Test') {
				steps {
					echo '=========================='
					echo 'Test Stage'
					echo '=========================='
					echo 'Testing Application...'
					sh 'cat index.html'
				}
		}
		stage('Deploy') {
				steps {
					echo '==========================='
					echo 'Deploy Stage'
					echo '==========================='	
					echo 'Deployment simulation successfull!'
				}
		}
	}

	post {
		success {
			echo 'Pipeline completed successfully!'
			}
		failure {
			echo 'Pipeline failed!'
		}
	}

}
