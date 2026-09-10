pipeline {

    agent any

    environment {
        IMAGE_NAME = 'devopspiyush0410/jenkins-day9-app'
	CONTAINER_NAME = 'jenkins-day9-app'
	HOST_PORT = '8087'
    }

    stages {

        stage('Information') {
            steps {
                echo '========================================'
                echo 'Jenkins Day 9 - Docker Image Versioning'
                echo '========================================'

                echo "Build Number: ${BUILD_NUMBER}"
		echo "Image Name: ${IMAGE_NAME}"
		echo "Image Tag: ${BUILD_NUMBER}"
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
			-t ${IMAGE_NAME}:${BUILD_NUMBER} .
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
				credentialsId: 'dockerHub-Secret',
				usernameVariable: 'DOCKER_USER',
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
	

	stage('Push Docker Image') {
		steps {
			echo '============================='
			echo 'Pushing Versioned Docker Image'
			echo '============================='

			sh '''
				docker push ${IMAGE_NAME}:${BUILD_NUMBER}
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
			${IMAGE_NAME}:${BUILD_NUMBER}

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
	
	stage('Show Docker Images') {
	    steps{

		echo '========================'
		echo 'Docker Image Information'
		echo '========================'

		sh '''
			docker images | grep jenkins-day9-app || true
		'''
	    }
	}
   }

    post {

        success {
		sh 'docker logout || true'
		echo '==================='
		echo 'SUCESS'
		echo '==================='

		echo 'Docker image version ${BUILD_NUMBER} pushed successfully!'
		echo "Container deployed successfully!"	
        }

        failure {
		sh 'docker logout || true'

		echo '============================='	
		echo 'Jenkins Day 9 Pipeline Failed'
		echo '============================='
        }
    }
}
