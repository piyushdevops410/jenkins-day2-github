pipeline {

    agent any

    environment {
        IMAGE_NAME = 'devopspiyush0410/jenkins-day8-app'
	IMAGE_TAG = '1.0'
	CONTAINER_NAME = 'jenkins-day8-app'
	HOST_PORT = '8087'
    }

    stages {

        stage('Information') {
            steps {
                echo '========================================'
                echo 'Jenkins Day 8 - Docker Deployment'
                echo '========================================'

                echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
                echo "Container Name: ${CONTAINER_NAME}"
		echo "Host Port: ${HOST_PORT}"
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '========================================'
                echo 'Building Docker Image'
                echo '========================================'

                sh '''
			docker build \
			-t ${IMAGE_NAME}:${IMAGE_TAG} .
		'''
            }
        }

        stage('Docker Login') {
            steps {
                echo '========================================'
                echo 'Login to Docker Hub'
                echo '========================================'
		
		withCredentials([
			usernamePassword(
				credentialsId: 'dockerhub-creds',
				usernameVariable: 'Docker_USER',
				passwordVariable: 'DOCKER_PASS'
			)		
		]) {
			sh '''
				echo "$DOCKER_PASS" | docker login \
				-u "$DOCKER_USER" \
				--password-stdin
			'''
		 }
            }	
        }
	

	stage('Push Image') {
		steps {
			echo '============================='
			echo 'Pushing Image to Docker Hub'
			echo '============================='

			sh '''
				docker push ${IMAGE_NAME}:${IMAGE_TAG}
			'''
		}
	}

        stage('Deploy Container') {
            steps {
                echo '========================================'
                echo 'Deploying Docker Container'
                echo '========================================'
		
		sh '''
                docker rm -f ${CONTAINER_NAME}  || true

		docker run -d \
			--name ${CONTAINER_NAME} \
			-p ${HOST_PORT}:80 \
			${IMAGE_NAME}:${IMAGE_TAG}

			docker ps
		'''
            }
        }

        stage('Test Container') {
            steps {
                echo '========================================'
                echo 'Testing  Container'
                echo '========================================'

                sh 'sleep 3'
		sh 'curl -f http://localhost:${HOST_PORT}'
			
                echo 'Application test passed!'
            }
        }

   }

    post {

        success {
		sh 'docker logout || true'
		echo '==================='
		echo 'SUCESS'
		echo '==================='
		echo 'Docker image pushed and container deployed!'		
        }

        failure {
		sh 'docker logout || true'
		echo 'Jenkins Day 8 Pipeline Failed'
        }
    }
}
