pipeline {

    agent any

    environment {
        APP_NAME = 'jenkins-day6-app'
	IMAGE_TAG = '1.0'
	CONTAINER_NAME = 'jenkins-day6-app'
	HOST_PORT = '8086'
    }

    stages {

        stage('Information') {
            steps {
                echo '========================================'
                echo 'Jenkins Day 6 - Docker Integration'
                echo '========================================'

                echo "Application: ${env.APP_NAME}"
                echo "Image Tag: ${env.IMAGE_TAG}"
                echo "Container Name: ${env.CONTAINER_NAME}"
		echo "Host Port: ${env.HOST_PORT}"
            }
        }

	stage('Docker Check') {
	    steps {
		echo '=========================='
		echo 'Docker Check'
		echo '=========================='
		
		sh 'docker --version'
		sh 'docker info --format "{{.ServerVersion}}"'
	    }
	}

        stage('Build Docker Image') {
            steps {
                echo '========================================'
                echo 'Building Docker Image'
                echo '========================================'

                sh 'docker build -t ${APP_NAME}:${IMAGE_TAG} .'
            }
        }

        stage('List Docker Image') {
            steps {
                echo '========================================'
                echo 'Docker Image Created'
                echo '========================================'
		
		sh 'docker images ${APPNAME}'
            }
        }

        stage('Run Container') {
            steps {
                echo '========================================'
                echo 'Starting Container'
                echo '========================================'
		
		sh '''
                docker rm -f ${CONTAINER_NAME} 2>/dev/null || true
		docker run -d \
			--name${CONTAINER_NAME} \
			-p ${HOST_PORT}:80 \
			${APP_NAME}:${IMAGE_TAG}
		'''
		
		sh 'dcoker ps'
            }
        }

        stage('Test Container') {
            steps {
                echo '========================================'
                echo 'Testing  Container'
                echo '========================================'

                sh 'sleep 3'
		sh 'curl -f http://localhost:${HOST_PORT}'
			
                echo 'Container test passed!'
            }
        }

	stage('Cleanup') {
            steps {
                echo '========================================'
                echo 'Docker Cleanup'
                echo '========================================'

                sh 'docker stop ${CONTAINER_NAME} || true'
                sh 'docker rm ${CONTAINER_NAME} || true'

                echo 'Container Clean Completed!'
            }
        }
    }

    post {

        always {
            echo '========================================'
            echo 'Pipeline Finished'
            echo '========================================'
        }

        success {
            echo 'SUCCESS: Jenkins + Docker integration Working!'
        }

        failure {
            echo 'FAILURE: Jenkins + Docker Pipeline Failed!'
        }
    }
}
