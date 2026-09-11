pipeline {

    agent any
	
    environment {
        APP_NAME = 'jenkins-day11-app'
	DOCKER_USER = 'devopspiyush0410'
	IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Information') {
            steps {
                echo '========================================'
                echo 'Jenkins Day 11 - Artifact Lab'
                echo '========================================'

                echo "Application: ${APP_NAME}"
		echo "Build Number: ${BUILD_NUMBER}"
		echo "Docker Image: ${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG}"
		echo "Workspace: ${WORKSPACE}"
            }
        }

        stage('Build') {
            steps {
                echo '========================================'
                echo 'Building Stage'
                echo '========================================'

                sh '''
			docker build \
			-t ${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG} .
		'''
		
		
		sh 'docker images | grep jenkins-day11-app'
            }
        }

	stage('Create Artifact') {
	    steps {
		echo "============================"	  
		echo "Creating Build Artifact"
		echo "============================"

		sh '''
			echo "Application: ${APP_NAME}" > build-info.txt
			echo "Build Number: ${BUILD_NUMBER}" >> build-info.txt
			echo "Docker Image: ${DOCKER_USER}/${APP_NAME}:${IMAGE_TAG}" >> build-info.txt
			echo "Build Date: $(date)" >> build-info.txt
			echo "Jenkins Workspace: ${WORKSPACE}" >> build-info.txt

		'''

		sh 'cat build-info.txt'

	    }
	}

        stage('Test') {
            steps {
                echo '========================================'
                echo 'Archiving Artifact'
                echo '========================================'
		
		archiveArtifacts artifacts: 'build-info.txt', fingerprint: true
		
		echo "Artifact archived sucessfully!"
		
            }	
        }
	
}       

    post {

        success {
		echo '===================================='
		echo "SUCESS:"
		echo '===================================='
		echo "Jenkins Day11 Completed Successfully"
        }

        failure {
		echo '============================='	
		echo 'FAILURE: Please checkthe pipeline logs.'
		echo '============================='
        }
    }
}
