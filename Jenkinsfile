pipeline {

    agent any
	
    parameters {
	choice(
		name: 'ENVIRONMENT',
		choices: ['dev', 'staging', 'prod'],
		description: 'Select deployment envirnment'
	)

    }

    environment {
        APP_NAME = 'jenkins-day10-app'
	DOCKER_USER = 'devopspiyush0410'
	IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Information') {
            steps {
                echo '========================================'
                echo 'Jenkins Day 10 - Parameters Lab'
                echo '========================================'

                echo "Application: ${APP_NAME}"
		echo "ENVIRONMENT: ${params.ENVIRONMENT}"
		echo "Build Number: ${BUILD_NUMBER}"
		echo "Docker Image: ${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG}"
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '========================================'
                echo 'Building Docker Image'
                echo '========================================'

                sh '''
			docker build \
			-t ${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG} .
		'''
	
		sh 'docker images | grep jenkins-day10-app'
            }
        }

        stage('Test') {
            steps {
                echo '========================================'
                echo 'Testing Application'
                echo '========================================'
		
		sh 'test -f index.html'

		echo "Application Test Passed"

            }	
        }
	

	stage('Deploy DEV') {
		when {
			expression { 
				params.ENVIRONMENT == 'dev'
			}
	}

		steps {
			echo '========================================'
		        echo 'Deploying to DEV environment'
			echo '========================================'
		
			sh '''
				docker rm -f jenkins-day10-dev 2> /dev/null  || true

				docker run -d \
				--name jenkins-day10-dev \
				-p 8088:80 \
				${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG}

			'''

			echo "DEV deployment completed!"
            }
        }

        stage('Deploy STAGING') {
                when {
                        expression {
                                params.ENVIRONMENT == 'staging'
                        }
        }

                steps {
                        echo '========================================'
                        echo 'Deploying to STAGING environment'
                        echo '========================================'

                        sh '''
                                docker rm -f jenkins-day10-dev 2> /dev/null  || true

                                docker run -d \
                                --name jenkins-day10-staging \
                                -p 8088:80 \
				${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG}
				
                        '''

                        echo "STAGING deployment completed!"
            }
        }


        stage('Deploy PROD') {
                when {
                        expression {
                                params.ENVIRONMENT == 'prod'
                        }
        }

                steps {
                        echo '========================================'
                        echo 'Deploying to PROD environment'
                        echo '========================================'

                        sh '''
                                docker rm -f jenkins-day10-dev 2> /dev/null  || true

                                docker run -d \
                                --name jenkins-day10-prod \
                                -p 8088:80 \
				${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG}

                        '''

                        echo "PROD deployment completed!"
            }
        }

}       

    post {
	
	always { 
		echo '========================'
		echo "Pipeline Finished"
		echo '========================'
	}
        success {
		echo '==================='
		echo 'SUCESS: Day 10 parameterized deployment completed!'
		echo '==================='
        }

        failure {
		echo '============================='	
		echo 'FAILURE: Please checkthe pipeline logs.'
		echo '============================='
        }
    }
}
